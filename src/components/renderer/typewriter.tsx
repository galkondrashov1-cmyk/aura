"use client";

import { useEffect, useState } from "react";

/** Types each word, pauses, deletes, moves on — forever. Static for reduced motion. */
export function Typewriter({ words }: { words: string[] }) {
  const list = words.map((w) => w.trim()).filter(Boolean);
  const [i, setI] = useState(0);
  const [n, setN] = useState(list[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (list.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const word = list[i % list.length];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && n === word.length) t = setTimeout(() => setDeleting(true), 1500);
    else if (deleting && n === 0) {
      t = setTimeout(() => {
        setDeleting(false);
        setI((x) => (x + 1) % list.length);
      }, 250);
    } else t = setTimeout(() => setN((x) => x + (deleting ? -1 : 1)), deleting ? 38 : 75);
    return () => clearTimeout(t);
  }, [n, deleting, i, list]);

  if (list.length === 0) return null;
  const word = list[i % list.length];
  return (
    <span className="tw-caret font-medium text-primary">
      <span className="sr-only">{list.join(", ")}</span>
      <span aria-hidden>{word.slice(0, Math.min(n, word.length))}</span>
    </span>
  );
}
