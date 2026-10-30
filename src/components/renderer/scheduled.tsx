"use client";

import { useEffect, useState } from "react";
import { inWindow } from "@/lib/schedule";

/**
 * A scheduled link. The page HTML is cached for up to an hour, so the server's
 * answer is only the first guess: the visitor's clock decides on load, and the
 * link appears or disappears on the minute while the page is open.
 */
export function Scheduled({ from, until, shown, children }: { from?: string; until?: string; shown: boolean; children: React.ReactNode }) {
  const [on, setOn] = useState(shown);
  useEffect(() => {
    const check = () => setOn(inWindow(from, until, Date.now()));
    const first = requestAnimationFrame(check);
    const timers = [from, until]
      .map((x) => (x ? Date.parse(x) - Date.now() : 0))
      .filter((ms) => ms > 0 && ms < 2 ** 31 - 1)
      .map((ms) => setTimeout(check, ms + 50));
    return () => {
      cancelAnimationFrame(first);
      timers.forEach(clearTimeout);
    };
  }, [from, until]);
  return on ? children : null;
}
