"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Phone mockup that flips between real, server-rendered template pages.
 * Auto-advances until the visitor picks one themselves.
 */
export function Showcase({ slides }: { slides: { id: string; name: string; node: React.ReactNode }[] }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 3800);
    return () => clearInterval(t);
  }, [auto, slides.length]);

  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[7px] border-text bg-black">
        <span className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-text" />
        {slides.map((s, j) => (
          <div
            key={s.id}
            aria-hidden={j !== i}
            inert={j !== i}
            className={cn(
              "absolute inset-0 transition-[clip-path] duration-700 ease-[var(--ease)]",
              j === i ? "[clip-path:inset(0)]" : "pointer-events-none [clip-path:inset(0_0_0_100%)]",
            )}
          >
            {s.node}
          </div>
        ))}
      </div>
      <div className="mt-5 flex max-w-[340px] flex-wrap gap-x-4 gap-y-1">
        {slides.map((s, j) => (
          <button
            key={s.id}
            onClick={() => {
              setI(j);
              setAuto(false);
            }}
            className={cn(
              "border-b-2 py-1 text-sm transition-colors",
              j === i ? "border-primary text-text" : "border-transparent text-text-muted hover:text-text",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
