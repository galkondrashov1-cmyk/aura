"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { TYPE_FX, type Typing } from "@/lib/typing";

const SPEED = { slow: 1.6, normal: 1, fast: 0.6 } as const;
const HE = "אבגדהוזחטיכלמנסעפצקרשת";
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/** Natural rhythm: every keystroke lands a little early or late. */
const jitter = (ms: number) => ms * (0.65 + Math.random() * 0.7);

/**
 * Rotating words after the tagline. Character effects (type / erase /
 * scramble) drive the text keystroke by keystroke; word effects (fade, slide,
 * blur, flip, wave, marker) swap whole words with a CSS entrance. Reduced
 * motion shows the first word, still.
 */
export function Typewriter({ words, typing }: { words: string[]; typing?: Typing }) {
  const list = useMemo(() => words.map((w) => w.trim()).filter(Boolean), [words]);
  const fx = TYPE_FX.some((f) => f.id === typing?.fx) ? typing!.fx! : "type";
  const k = SPEED[typing?.speed ?? "normal"] ?? 1;
  const loop = typing?.loop !== false;
  const charFx = fx === "type" || fx === "erase" || fx === "scramble";

  const [i, setI] = useState(0);
  const [n, setN] = useState(charFx ? 0 : (list[0]?.length ?? 0));
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "select">("in");
  const [noise, setNoise] = useState("");
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setStill(true));
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const word = list[i % Math.max(1, list.length)] ?? "";
  const last = !loop && i === list.length - 1;

  useEffect(() => {
    if (still || list.length === 0) return;
    let t: ReturnType<typeof setTimeout>;
    const next = () => {
      setI((x) => (x + 1) % list.length);
      setN(0);
      setPhase("in");
    };
    if (!charFx) {
      if (list.length < 2 || last) return;
      t = setTimeout(next, 2400 * k);
    } else if (phase === "in") {
      if (n < word.length) {
        const step = fx === "scramble" ? 34 : 72;
        t = setTimeout(() => {
          if (fx === "scramble") {
            const pool = /[֐-׿]/.test(word) ? HE : LATIN;
            setNoise(Array.from({ length: word.length - n - 1 }, () => pool[Math.floor(Math.random() * pool.length)]).join(""));
          }
          setN((x) => x + 1);
        }, jitter(step * k));
      } else t = setTimeout(() => setPhase("hold"), 0);
    } else if (phase === "hold") {
      if (last || list.length < 2) return;
      t = setTimeout(() => setPhase(fx === "erase" ? "select" : "out"), 1600 * k);
    } else if (phase === "select") {
      t = setTimeout(next, 420 * k);
    } else if (phase === "out") {
      if (fx === "scramble") t = setTimeout(next, 60);
      else if (n > 0) t = setTimeout(() => setN((x) => x - 1), jitter(36 * k));
      else t = setTimeout(next, 220 * k);
    }
    return () => clearTimeout(t);
  }, [still, list, charFx, fx, k, n, phase, word, last]);

  if (list.length === 0) return null;
  const color = typing?.color ?? "accent";
  const cursor = typing?.cursor ?? "bar";

  let visible: React.ReactNode;
  if (still) visible = list[0];
  else if (fx === "type" || fx === "erase") {
    visible = <span className={phase === "select" ? "tw-sel" : undefined}>{word.slice(0, n)}</span>;
  } else if (fx === "scramble") {
    visible = (
      <>
        {word.slice(0, n)}
        <span className="opacity-50">{phase === "in" ? noise : ""}</span>
      </>
    );
  } else if (fx === "wave") {
    visible = (
      <span key={i} className="tw-wave">
        {Array.from(word).map((ch, j) => (
          <span key={j} style={{ "--i": j } as React.CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    );
  } else {
    visible = (
      <span key={i} className={`tw-${fx}`}>
        {word}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "tw font-medium",
        color === "accent" && "text-primary",
        color === "gradient" && "tw-grad",
        charFx && !still && cursor !== "none" && `tw-caret tw-cur-${cursor}`,
      )}
    >
      <span className="sr-only">{list.join(", ")}</span>
      <span aria-hidden>{visible}</span>
    </span>
  );
}
