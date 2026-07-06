"use client";

// The hero centerpiece: a revolving ring of light with orbiting text, and a
// floating mini business-page inside it. The whole section glows toward the
// cursor (CSS vars --mx/--my).
import { useRef } from "react";
import { HaloCalendar } from "@/components/halo-icons";

export function HeroGlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
      className="relative"
    >
      <div className="cursor-halo pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

const ORBIT_TEXT = "ההילה של העסק שלך • זימון תורים • עיצוב שמאיר • ".repeat(2);

export function HaloStage() {
  return (
    <div className="phone-float relative mx-auto h-[340px] w-[340px] sm:h-[420px] sm:w-[420px]">
      {/* revolving band of light */}
      <div className="hero-ring absolute inset-0 rounded-full" />
      {/* soft inner glow */}
      <div
        className="absolute inset-10 rounded-full opacity-50 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(240,180,41,0.35), rgba(139,124,246,0.12) 60%, transparent 75%)" }}
      />
      {/* orbiting text */}
      <svg viewBox="0 0 200 200" className="orbit-text absolute -inset-7 sm:-inset-9" aria-hidden>
        <defs>
          <path id="orbit" d="M 100,100 m -84,0 a 84,84 0 1,1 168,0 a 84,84 0 1,1 -168,0" />
        </defs>
        <text fontSize="8.5" fill="rgba(236,238,242,0.55)" fontWeight="600" letterSpacing="1.5">
          <textPath href="#orbit">{ORBIT_TEXT}</textPath>
        </text>
      </svg>

      {/* the mini business page floating inside the halo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 rounded-[1.6rem] border border-white/12 bg-[#141722]/95 p-4 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur sm:w-64">
          <div className="relative mx-auto mb-2 h-14 w-14">
            <div
              className="absolute -inset-1.5 rounded-full"
              style={{
                background: "conic-gradient(from 200deg,#f0b429,#ffd166,#8b7cf6,#f0b429)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              }}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-night-3 text-3xl">💇</div>
          </div>
          <p className="text-sm font-extrabold text-ink">המספרה של נועה</p>
          <p className="mt-0.5 text-[10px] text-ink-2">כי לשיער שלך מגיעה הילה</p>
          <div className="mt-3 flex flex-col gap-1.5 text-start">
            {[
              ["תספורת + פן", "₪120"],
              ["צבע מלא", "₪280"],
            ].map(([name, price]) => (
              <div key={name} className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px]">
                <span className="text-ink">{name}</span>
                <span className="font-bold text-halo">{price}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-full bg-halo px-3 py-2 text-[11px] font-bold text-night shadow-[0_0_18px_rgba(240,180,41,0.5)]">
            לקביעת תור ←
          </div>
        </div>
      </div>

      {/* floating confirmation toast */}
      <div className="absolute -left-3 top-14 flex items-center gap-2 rounded-xl border border-mint/30 bg-night-2/95 px-3 py-2 shadow-lg backdrop-blur sm:-left-10">
        <HaloCalendar size={20} className="text-mint" />
        <div className="text-start">
          <p className="text-[10px] font-bold text-ink">תור חדש! יעל, יום ג׳ 14:30</p>
          <p className="text-[9px] text-ink-2">אושר אוטומטית ✓</p>
        </div>
      </div>
      {/* floating views chip */}
      <div className="absolute -right-1 bottom-16 rounded-xl border border-line bg-night-2/95 px-3 py-2 text-start shadow-lg backdrop-blur sm:-right-7">
        <p className="text-[10px] font-bold text-ink">👀 128 צפיות השבוע</p>
        <p className="text-[9px] text-ink-2">+34% מהשבוע שעבר</p>
      </div>
    </div>
  );
}
