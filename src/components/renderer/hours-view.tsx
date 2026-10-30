"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { BlockOf } from "@/lib/blocks";
import type { Strings } from "@/lib/i18n";
import { hoursLabel, hoursStatus, israelNow } from "@/lib/hours";

/**
 * Opening hours with a live "open now" line. Days with the same hours collapse
 * into one row ("Sunday–Thursday"). The clock is read only after mount: the
 * server HTML is cached, so it must not bake in a time.
 */
export function HoursView({ b, t }: { b: BlockOf<"hours">; t: Strings }) {
  const [now, setNow] = useState<{ day: number; min: number } | null>(null);
  useEffect(() => {
    const tick = () => setNow(israelNow());
    const first = requestAnimationFrame(tick);
    const timer = setInterval(tick, 30_000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(timer);
    };
  }, []);

  const rows: { from: number; to: number; label: string }[] = [];
  b.days.forEach((d, i) => {
    const label = hoursLabel(d);
    const last = rows.at(-1);
    if (last && last.label === label) last.to = i;
    else rows.push({ from: i, to: i, label });
  });

  const status = now && hoursStatus(b.days, now);
  let line = "";
  if (status?.open) line = `${t.closesAt} ${status.until}`;
  else if (status?.next) {
    const { inDays, day, at } = status.next;
    line = inDays === 0 ? `${t.opensAt}${at}` : inDays === 1 ? `${t.opensTomorrow}${at}` : `${t.opensOn} ${t.dayNames[day]} ${at}`;
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        {b.heading && <p className="font-display text-lg font-medium">{b.heading}</p>}
        <p className="flex min-h-5 items-center gap-1.5 text-sm" aria-live="polite">
          {status && (
            <>
              <span className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-rose-500")} aria-hidden />
              <span className="font-medium">{status.open ? t.openNow : t.closedNow}</span>
              {line && <span className="text-text-muted">· {line.replace(/(\d\d:\d\d)/, "\u2066$1\u2069")}</span>}
            </>
          )}
        </p>
      </div>
      <dl className="divide-y divide-border text-sm">
        {rows.map((r) => {
          const today = now !== null && now.day >= r.from && now.day <= r.to;
          return (
            <div key={r.from} className={cn("flex justify-between gap-4 py-2", today ? "font-medium" : "text-text-muted")}>
              <dt>
                {r.from === r.to ? t.dayNames[r.from] : `${t.dayNames[r.from]}–${t.dayNames[r.to]}`}
                {today && <span className="ms-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" aria-hidden />}
              </dt>
              <dd dir="ltr" className="tabular-nums">{r.label || t.closed}</dd>
            </div>
          );
        })}
      </dl>
      {b.note && <p className="mt-3 text-xs text-text-muted">{b.note}</p>}
    </div>
  );
}
