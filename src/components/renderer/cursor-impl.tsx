"use client";

import { useEffect, useRef } from "react";

/* Custom cursors for public pages (Pro). Desktop / fine pointers only — touch
   devices keep their native behavior. The system cursor stays visible for
   precision except in "blend", where the disc itself is the cursor. */
export default function CursorImpl({ variant }: { variant: string }) {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hover = false;
    let raf = 0;
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const cv = trail.current;
    const ctx = cv?.getContext("2d") ?? null;
    const primary =
      getComputedStyle(dot.current?.parentElement ?? document.body).getPropertyValue("--primary").trim() || "#00e5a0";

    const size = () => {
      if (!cv) return;
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    size();

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest("a,button,summary,input,textarea,select,[role=button]");
      if (variant === "trail" && !reduced) {
        for (let i = 0; i < 2; i++) {
          sparks.push({ x: mx, y: my, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6 - 0.4, life: 1 });
        }
      }
    };

    const tick = () => {
      rx += (mx - rx) * (reduced ? 1 : 0.18);
      ry += (my - ry) * (reduced ? 1 : 0.18);
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${hover ? 1.7 : 1})`;
      }
      if (ctx && cv) {
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.03;
          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = s.life;
          ctx.fillStyle = primary;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.4 * s.life, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size);
    raf = requestAnimationFrame(tick);
    if (variant === "blend") document.documentElement.style.cursor = "none";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
      document.documentElement.style.cursor = "";
    };
  }, [variant]);

  const base = "pointer-events-none fixed top-0 left-0 z-[70] hidden [@media(pointer:fine)]:block";
  if (variant === "trail") {
    return (
      <>
        <canvas ref={trail} aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden [@media(pointer:fine)]:block" />
        <div ref={dot} aria-hidden className={base}>
          <span className="block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      </>
    );
  }
  if (variant === "glow") {
    return (
      <div ref={ring} aria-hidden className={base} style={{ transition: "transform 0.05s linear" }}>
        <span
          className="block h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
          style={{ background: "var(--primary)" }}
        />
      </div>
    );
  }
  if (variant === "blend") {
    return (
      <div ref={ring} aria-hidden className={base} style={{ mixBlendMode: "difference" }}>
        <span className="block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform" />
      </div>
    );
  }
  // ring
  return (
    <>
      <div ref={ring} aria-hidden className={base} style={{ transition: "transform 0.12s ease-out", transformOrigin: "0 0" }}>
        <span className="block h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/80" />
      </div>
      <div ref={dot} aria-hidden className={base}>
        <span className="block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
      </div>
    </>
  );
}
