// Opening-hours math for the Hours block. Times are wall-clock "HH:MM" in
// Israel time; a range whose end is not after its start runs past midnight.
import type { DayHours } from "@/lib/blocks";

const TZ = "Asia/Jerusalem";
const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

/** [start, end) minute ranges for a day; overnight ranges end after 1440. */
export function rangesOf(d?: DayHours): [number, number][] {
  if (!d || d.closed) return [];
  const out: [number, number][] = [];
  for (const [a, b] of [[d.from, d.to], [d.from2, d.to2]]) {
    if (!a || !b) continue;
    const s = mins(a);
    let e = mins(b);
    if (e <= s) e += 1440;
    out.push([s, e]);
  }
  return out;
}

/** Day of week (0 = Sunday) and minutes since midnight, in Israel. */
export function israelNow(at = new Date()): { day: number; min: number } {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(at)
      .map((x) => [x.type, x.value]),
  );
  return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), min: Number(p.hour) * 60 + Number(p.minute) };
}

const clock = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export type HoursStatus = { open: true; until: string } | { open: false; next?: { inDays: number; day: number; at: string } };

export function hoursStatus(days: DayHours[], now = israelNow()): HoursStatus {
  const { day, min } = now;
  // Still inside last night's overnight range?
  for (const [, e] of rangesOf(days[(day + 6) % 7])) if (e > 1440 && min < e - 1440) return { open: true, until: clock(e) };
  for (const [s, e] of rangesOf(days[day])) if (min >= s && min < e) return { open: true, until: clock(e) };
  for (let k = 0; k < 7; k++) {
    const d = (day + k) % 7;
    const start = rangesOf(days[d])
      .map(([s]) => s)
      .filter((s) => k > 0 || s > min)
      .sort((a, b) => a - b)[0];
    if (start !== undefined) return { open: false, next: { inDays: k, day: d, at: clock(start) } };
  }
  return { open: false };
}

/** "09:00–13:00, 16:00–19:00", or "" when closed. */
export function hoursLabel(d?: DayHours): string {
  return rangesOf(d)
    .map(([s, e]) => `${clock(s)}–${clock(e)}`)
    .join(", ");
}
