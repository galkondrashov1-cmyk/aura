import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 540 → "09:00" */
export function minToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "09:00" → 540 */
export function timeToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Current time, callable from components (react-compiler bans Date.now() in render). */
export function nowMs(): number {
  return Date.now();
}

export const DAY_NAMES = [
  "ראשון",
  "שני",
  "שלישי",
  "רביעי",
  "חמישי",
  "שישי",
  "שבת",
];

/** Israeli phone: 05X-XXXXXXX (accepts with/without dashes and spaces). */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (/^05\d{8}$/.test(digits)) return digits;
  if (/^9725\d{8}$/.test(digits)) return `0${digits.slice(3)}`;
  return null;
}

export function formatPhone(phone: string): string {
  return phone.length === 10 ? `${phone.slice(0, 3)}-${phone.slice(3)}` : phone;
}

export function formatPrice(price: number): string {
  return `₪${price}`;
}

const HE_DATE = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Jerusalem",
});
const HE_TIME = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jerusalem",
});

export function formatHeDate(d: Date): string {
  return HE_DATE.format(d);
}
export function formatHeTime(d: Date): string {
  return HE_TIME.format(d);
}
