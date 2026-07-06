"use client";

import { useActionState, useState } from "react";
import { saveHours, type HoursState } from "@/lib/actions/hours";
import { Button } from "@/components/ui";
import { DAY_NAMES, minToTime, cn } from "@/lib/utils";

type Row = { day: number; startMin: number; endMin: number };

export function HoursForm({ initial }: { initial: Row[] }) {
  const [state, action, pending] = useActionState<HoursState, FormData>(saveHours, null);
  const [enabled, setEnabled] = useState<boolean[]>(
    Array.from({ length: 7 }, (_, d) => initial.some((r) => r.day === d)),
  );

  const rowFor = (d: number): Row => initial.find((r) => r.day === d) ?? { day: d, startMin: 540, endMin: 1020 };

  return (
    <form action={action} className="card flex flex-col gap-2 p-5">
      {state?.error && (
        <p className="mb-2 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">{state.error}</p>
      )}
      {state?.saved && (
        <p className="mb-2 rounded-xl bg-mint/10 px-3.5 py-2.5 text-sm text-mint">השעות נשמרו ✓</p>
      )}
      {Array.from({ length: 7 }, (_, d) => {
        const row = rowFor(d);
        const on = enabled[d];
        return (
          <div
            key={d}
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3",
              !on && "opacity-50",
            )}
          >
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name={`enabled-${d}`}
                checked={on}
                onChange={(e) =>
                  setEnabled((prev) => prev.map((v, i) => (i === d ? e.target.checked : v)))
                }
                className="h-4 w-4 accent-[#f0b429]"
              />
              <span className="w-16 font-semibold">{DAY_NAMES[d]}</span>
            </label>
            <div className="flex items-center gap-2" dir="ltr">
              <input
                type="time"
                name={`start-${d}`}
                defaultValue={minToTime(row.startMin)}
                disabled={!on}
                className="rounded-lg border border-line bg-night-3 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-halo/60"
              />
              <span className="text-ink-2">–</span>
              <input
                type="time"
                name={`end-${d}`}
                defaultValue={minToTime(row.endMin)}
                disabled={!on}
                className="rounded-lg border border-line bg-night-3 px-2.5 py-1.5 text-sm text-ink outline-none focus:border-halo/60"
              />
            </div>
          </div>
        );
      })}
      <Button type="submit" disabled={pending} className="mt-3 self-start">
        {pending ? "שומרים…" : "שמירת שעות"}
      </Button>
    </form>
  );
}
