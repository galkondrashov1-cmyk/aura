"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive background effects that follow the pointer (Higgsfield-style).
 * The overlay itself is pointer-events-none; we listen on its parent (the
 * page root) so links/buttons keep working. Position is lerped in rAF for a
 * smooth, slightly-trailing feel; touch works too.
 */
export function CursorFx({ variant }: { variant: "cursorglow" | "cursorgrid" | "cursorspot" }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    const host = node?.parentElement;
    if (!node || !host) return;

    let tx = host.clientWidth / 2;
    let ty = host.clientHeight * 0.3;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      node.style.setProperty("--mx", `${x}px`);
      node.style.setProperty("--my", `${y}px`);
      raf = requestAnimationFrame(tick);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", `bgfx-${variant}`)}
    />
  );
}
