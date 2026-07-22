"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* Branded reveal that plays whenever a public useaura.me/<name> page opens.
   The curtain hides itself purely in CSS (fill-mode: forwards) and never
   captures pointer events, so the page stays usable even if this component
   never unmounts — the state flip below is only DOM cleanup. */
export function PageIntro({ bg }: { bg?: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={cn("aura-intro", !bg && "aura-backdrop")}
      style={bg ? { background: bg } : undefined}
    >
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* ripple that expands past the rings as the curtain lifts */}
        <circle className="pulse" cx="24" cy="24" r="14.5" stroke="currentColor" strokeWidth="1.4" />
        <circle className="ring r1" cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.6" />
        <circle className="ring r2" cx="24" cy="24" r="14.5" stroke="currentColor" strokeWidth="1.7" />
        <circle className="ring r3" cx="24" cy="24" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <circle className="ring r4" cx="24" cy="24" r="2.8" fill="currentColor" />
      </svg>
    </div>
  );
}
