"use client";

import { useEffect, useState } from "react";
import type { Strings } from "@/lib/i18n";

function parts(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function CountdownView({ target, label, t }: { target: string; label?: string; t: Strings }) {
  // null until mounted: the server HTML (cached by ISR, possibly hours old)
  // must not bake in a clock reading, or hydration would mismatch.
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = requestAnimationFrame(tick);
    const timer = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(timer);
    };
  }, []);

  const targetMs = new Date(target).getTime();
  if (Number.isNaN(targetMs)) {
    return (
      <p className="text-center text-sm text-text-muted">Set a countdown date…</p>
    );
  }
  const left = now === null ? Number.POSITIVE_INFINITY : targetMs - now;
  const done = left <= 0;
  const p = parts(Number.isFinite(left) ? left : 0);
  const pad = (v: number) => (now === null ? "--" : String(v).padStart(2, "0"));
  const tiles: [number, string][] = [
    [p.days, t.days],
    [p.hours, t.hours],
    [p.minutes, t.min],
    [p.seconds, t.sec],
  ];

  return (
    <div className="text-center">
      {label && <p className="mb-2.5 text-sm font-medium">{label}</p>}
      {done ? (
        <p className="font-display text-xl font-medium text-primary">{t.done}</p>
      ) : (
        <div className="grid grid-cols-4 gap-2" data-countdown>
          {tiles.map(([v, u]) => (
            <div
              key={u}
              className="rounded-2xl border border-border bg-surface/60 px-1 py-3 backdrop-blur"
            >
              <p className="font-display text-2xl font-medium text-primary tabular-nums" data-unit={u}>
                {pad(v)}
              </p>
              <p className="mt-0.5 text-[10px] tracking-wide text-text-muted uppercase">{u}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
