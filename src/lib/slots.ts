// Free-slot computation for the booking page. All wall-clock math happens in
// Asia/Jerusalem; DB stores UTC instants.
import { prisma } from "@/lib/prisma";

export const TZ = "Asia/Jerusalem";

/** UTC offset (minutes) that Jerusalem has on a given calendar date. */
function tzOffsetMin(dateStr: string): number {
  // DST switches at ~02:00 local; sampling noon UTC is safe for the whole day.
  const probe = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "longOffset",
  }).formatToParts(probe);
  const raw = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+02:00";
  const m = raw.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 120;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

/** "2026-07-06" + 540 (09:00 Jerusalem) → UTC Date. */
export function jerusalemToUtc(dateStr: string, minutes: number): Date {
  const base = new Date(`${dateStr}T00:00:00Z`).getTime();
  return new Date(base + (minutes - tzOffsetMin(dateStr)) * 60_000);
}

/** UTC Date → minutes since Jerusalem midnight of its Jerusalem date. */
export function utcToJerusalemMin(d: Date): { dateStr: string; minutes: number } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

/** Today's date string in Jerusalem. */
export function todayStr(): string {
  return utcToJerusalemMin(new Date()).dateStr;
}

/** Day of week (0=Sunday) of a YYYY-MM-DD calendar date. */
export function dayOfWeek(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

export type Slot = { minutes: number; time: string };

/**
 * Compute available start times for a service on a date.
 * A slot is free when [start, start+duration+buffer) doesn't overlap any
 * PENDING/CONFIRMED appointment (each padded by the business buffer).
 */
export async function freeSlots(opts: {
  businessId: string;
  dateStr: string;
  durationMin: number;
}): Promise<Slot[]> {
  const { businessId, dateStr, durationMin } = opts;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return [];

  const biz = await prisma.business.findUnique({
    where: { id: businessId },
    select: { slotStepMin: true, bufferMin: true },
  });
  if (!biz) return [];

  const hours = await prisma.workingHour.findUnique({
    where: { businessId_day: { businessId, day: dayOfWeek(dateStr) } },
  });
  if (!hours) return [];

  const dayStart = jerusalemToUtc(dateStr, 0);
  const dayEnd = jerusalemToUtc(dateStr, 24 * 60);
  const appts = await prisma.appointment.findMany({
    where: {
      businessId,
      status: { in: ["PENDING", "CONFIRMED"] },
      startsAt: { lt: dayEnd },
      endsAt: { gt: dayStart },
    },
    select: { startsAt: true, endsAt: true },
  });

  const buffer = biz.bufferMin * 60_000;
  const busy = appts.map((a) => ({
    from: a.startsAt.getTime() - buffer,
    to: a.endsAt.getTime() + buffer,
  }));

  const step = Math.max(5, biz.slotStepMin);
  const now = Date.now();
  const out: Slot[] = [];
  for (let m = hours.startMin; m + durationMin <= hours.endMin; m += step) {
    const from = jerusalemToUtc(dateStr, m).getTime();
    const to = from + durationMin * 60_000;
    if (from <= now) continue; // past
    if (busy.some((b) => from < b.to && to > b.from)) continue;
    const h = Math.floor(m / 60);
    const mm = m % 60;
    out.push({ minutes: m, time: `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}` });
  }
  return out;
}
