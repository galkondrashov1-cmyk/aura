"use client";

import { useEffect, useState } from "react";

function parts(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function CountdownView({ target, label }: { target: string; label?: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const targetMs = new Date(target).getTime();
  if (Number.isNaN(targetMs)) {
    return (
      <p className="text-center text-sm text-text-muted">Set a countdown date…</p>
    );
  }
  const left = targetMs - now;
  const done = left <= 0;
  const p = parts(left);
  const tiles: [number, string][] = [
    [p.days, "Days"],
    [p.hours, "Hours"],
    [p.minutes, "Min"],
    [p.seconds, "Sec"],
  ];

  return (
    <div className="text-center">
      {label && <p className="mb-2.5 text-sm font-medium">{label}</p>}
      {done ? (
        <p className="font-display text-xl font-medium text-primary">It&apos;s time! 🎉</p>
      ) : (
        <div className="grid grid-cols-4 gap-2" data-countdown>
          {tiles.map(([v, u]) => (
            <div
              key={u}
              className="rounded-2xl border border-border bg-surface/60 px-1 py-3 backdrop-blur"
            >
              <p className="font-display text-2xl font-medium text-primary tabular-nums" data-unit={u}>
                {String(v).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-[10px] tracking-wide text-text-muted uppercase">{u}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
