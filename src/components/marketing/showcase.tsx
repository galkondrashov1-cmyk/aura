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
    <div className="flex flex-col items-center">
      <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[44px] border-[8px] border-[#1a1d24] bg-black shadow-[0_40px_120px_-30px_rgba(0,229,160,0.35)] ring-1 ring-white/10">
        <span className="absolute top-2 left-1/2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        {slides.map((s, j) => (
          <div
            key={s.id}
            aria-hidden={j !== i}
            className={cn(
              "absolute inset-0 transition-all duration-700",
              j === i ? "scale-100 opacity-100" : "pointer-events-none scale-[1.04] opacity-0",
            )}
          >
            {s.node}
          </div>
        ))}
      </div>
      <div className="mt-5 flex max-w-[340px] flex-wrap justify-center gap-1.5">
        {slides.map((s, j) => (
          <button
            key={s.id}
            onClick={() => {
              setI(j);
              setAuto(false);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              j === i ? "border-primary bg-primary/15 text-text" : "border-border text-text-muted hover:text-text",
            )}
          >
            {s.name}
          </button>
        ))}
      </div>
    </div>
  );
}
