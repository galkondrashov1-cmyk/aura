"use client";

// Customer-facing booking flow, styled with the business's own design:
// service → date → time → details + OTP (demo) → confirmation.
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, ChevronRight, Clock, Hourglass, Loader2 } from "lucide-react";
import { designStyle, type SiteDesign } from "@/lib/design";
import type { RenderService } from "@/components/site-renderer";
import { cn, formatPrice, nowMs } from "@/lib/utils";
import type { CSSProperties } from "react";

type Slot = { minutes: number; time: string };
type Step = "service" | "date" | "details" | "done";

const DAY_SHORT = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

/** Next 21 calendar days in Asia/Jerusalem as {dateStr, day, label}. */
function nextDays(workDays: number[]) {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem", year: "numeric", month: "2-digit", day: "2-digit" });
  const out: { dateStr: string; day: number; dayName: string; label: string }[] = [];
  const start = nowMs();
  for (let i = 0; i < 21; i++) {
    const d = new Date(start + i * 24 * 60 * 60 * 1000);
    const dateStr = fmt.format(d); // YYYY-MM-DD
    const day = new Date(`${dateStr}T00:00:00Z`).getUTCDay();
    if (!workDays.includes(day)) continue;
    const [, m, dd] = dateStr.split("-").map(Number);
    out.push({
      dateStr,
      day,
      dayName: DAY_SHORT[day],
      label: `${dd} ב${MONTHS[m - 1]}`,
    });
  }
  return out;
}

export function BookingWizard({
  slug,
  businessName,
  emoji,
  design,
  autoConfirm,
  workDays,
  services,
}: {
  slug: string;
  businessName: string;
  emoji: string;
  design: SiteDesign;
  autoConfirm: boolean;
  workDays: number[];
  services: RenderService[];
}) {
  const { bg, vars } = designStyle(design);
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<RenderService | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ status: string } | null>(null);

  const days = useMemo(() => nextDays(workDays), [workDays]);

  async function loadSlots(d: string, svc: RenderService) {
    setSlots(null);
    setSlot(null);
    const res = await fetch(
      `/api/slots?slug=${encodeURIComponent(slug)}&serviceId=${encodeURIComponent(svc.id)}&date=${d}`,
    );
    const data = await res.json().catch(() => ({ slots: [] }));
    setSlots(data.slots ?? []);
  }

  function pickDate(d: string) {
    setDate(d);
    if (service) void loadSlots(d, service);
  }

  async function sendOtp() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "שגיאה");
      setOtpSent(true);
      setDemoCode(data.demoCode ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה — נסו שוב");
    } finally {
      setBusy(false);
    }
  }

  async function book() {
    if (!service || !date || !slot) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          serviceId: service.id,
          date,
          minutes: slot.minutes,
          name,
          phone,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.slotTaken && service && date) {
          setStep("date");
          void loadSlots(date, service);
        }
        throw new Error(data.error ?? "שגיאה");
      }
      setResult({ status: data.status });
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה — נסו שוב");
    } finally {
      setBusy(false);
    }
  }

  const dayLabel = days.find((d) => d.dateStr === date)?.label;

  return (
    <div className="site-scope relative min-h-dvh overflow-hidden" style={vars as CSSProperties} dir="rtl">
      {bg.animated && <div className="bg-animated absolute inset-0" style={{ background: bg.css }} />}
      <div className="relative mx-auto flex max-w-lg flex-col gap-5 px-5 pb-16 pt-8">
        {/* header */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${slug}`}
            className="site-card flex h-10 w-10 items-center justify-center"
            aria-label="חזרה לעמוד העסק"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{emoji || "✨"}</span>
            <div>
              <p className="text-sm" style={{ color: "var(--site-muted)" }}>קביעת תור אצל</p>
              <h1 className="text-lg font-extrabold leading-tight">{businessName}</h1>
            </div>
          </div>
        </div>

        {/* breadcrumb of choices */}
        {step !== "service" && step !== "done" && (
          <div className="flex flex-wrap items-center gap-1.5 text-sm" style={{ color: "var(--site-muted)" }}>
            <button onClick={() => setStep("service")} className="underline cursor-pointer">{service?.name}</button>
            {date && slot && step === "details" && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <button onClick={() => setStep("date")} className="underline cursor-pointer">
                  {dayLabel} · {slot.time}
                </button>
              </>
            )}
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-500">{error}</p>
        )}

        {/* ── step 1: service ── */}
        {step === "service" && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">במה נוכל לעזור?</h2>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setService(s);
                  setDate(null);
                  setStep("date");
                }}
                className="site-card flex items-center justify-between gap-3 px-5 py-4 text-start transition hover:scale-[1.01] cursor-pointer"
              >
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm" style={{ color: "var(--site-muted)" }}>
                    <Clock className="h-3.5 w-3.5" /> {s.durationMin} דק׳
                    {s.description && ` · ${s.description}`}
                  </p>
                </div>
                {s.price != null && (
                  <span className="shrink-0 text-lg font-extrabold" style={{ color: "var(--site-accent)" }}>
                    {formatPrice(s.price)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── step 2: date + time ── */}
        {step === "date" && service && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">מתי נוח לך?</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 thin-scroll">
              {days.map((d) => (
                <button
                  key={d.dateStr}
                  onClick={() => pickDate(d.dateStr)}
                  className={cn(
                    "site-card min-w-16 shrink-0 px-3 py-2.5 text-center transition cursor-pointer",
                    date === d.dateStr && "ring-2",
                  )}
                  style={date === d.dateStr ? ({ "--tw-ring-color": "var(--site-accent)" } as CSSProperties) : undefined}
                >
                  <p className="text-xs" style={{ color: "var(--site-muted)" }}>{d.dayName}</p>
                  <p className="mt-0.5 text-sm font-bold whitespace-nowrap">{d.label}</p>
                </button>
              ))}
            </div>

            {date && (
              <>
                {slots === null ? (
                  <p className="flex items-center gap-2 py-6 text-sm" style={{ color: "var(--site-muted)" }}>
                    <Loader2 className="h-4 w-4 animate-spin" /> בודקים אילו שעות פנויות…
                  </p>
                ) : slots.length === 0 ? (
                  <p className="site-card px-5 py-6 text-center text-sm">
                    אין שעות פנויות ביום הזה — נסו יום אחר 🙏
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {slots.map((s) => (
                      <button
                        key={s.minutes}
                        onClick={() => {
                          setSlot(s);
                          setStep("details");
                        }}
                        className="site-btn site-btn-soft px-2 py-2.5 text-sm font-bold cursor-pointer"
                        dir="ltr"
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── step 3: details + OTP ── */}
        {step === "details" && service && date && slot && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">עוד רגע וסיימנו</h2>
            <div className="site-card flex flex-col gap-1 px-5 py-4 text-sm">
              <p><b>{service.name}</b>{service.price != null && ` · ${formatPrice(service.price)}`}</p>
              <p style={{ color: "var(--site-muted)" }}>
                {dayLabel} · {slot.time} · {service.durationMin} דק׳
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="השם המלא שלך"
                className="site-card w-full px-4 py-3 outline-none placeholder:opacity-50"
                maxLength={60}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="טלפון נייד (050-1234567)"
                inputMode="tel"
                dir="ltr"
                className="site-card w-full px-4 py-3 text-left outline-none placeholder:opacity-50"
                maxLength={13}
                disabled={otpSent}
              />

              {!otpSent ? (
                <button
                  onClick={sendOtp}
                  disabled={busy || name.trim().length < 2 || phone.replace(/[^\d]/g, "").length < 10}
                  className={`site-btn site-btn-${design.buttonFill} px-5 py-3.5 font-bold disabled:opacity-50 cursor-pointer`}
                >
                  {busy ? "שולחים קוד…" : "שליחת קוד אימות ב־SMS"}
                </button>
              ) : (
                <>
                  {demoCode && (
                    <div className="rounded-xl border-2 border-dashed px-4 py-3 text-center text-sm" style={{ borderColor: "var(--site-accent)" }}>
                      <b>מצב דמו:</b> קוד האימות שלך הוא{" "}
                      <span className="text-lg font-extrabold tracking-widest" style={{ color: "var(--site-accent)" }} dir="ltr">
                        {demoCode}
                      </span>
                      <p className="mt-1 text-xs" style={{ color: "var(--site-muted)" }}>
                        (כשהמערכת תעלה לאוויר, הקוד יגיע ב־SMS אמיתי)
                      </p>
                    </div>
                  )}
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
                    placeholder="• • • •"
                    inputMode="numeric"
                    dir="ltr"
                    className="site-card w-full px-4 py-3 text-center text-xl font-extrabold tracking-[0.5em] outline-none placeholder:opacity-40"
                  />
                  <button
                    onClick={book}
                    disabled={busy || code.length !== 4}
                    className={`site-btn site-btn-${design.buttonFill} px-5 py-3.5 text-lg font-bold disabled:opacity-50 cursor-pointer`}
                  >
                    {busy ? "קובעים את התור…" : "אישור וקביעת התור ✓"}
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setDemoCode(null);
                      setCode("");
                    }}
                    className="text-sm underline cursor-pointer"
                    style={{ color: "var(--site-muted)" }}
                  >
                    טעות במספר? שינוי טלפון
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── step 4: done ── */}
        {step === "done" && result && (
          <div className="site-card flex flex-col items-center gap-4 px-6 py-10 text-center">
            {result.status === "CONFIRMED" ? (
              <>
                <CalendarCheck className="h-14 w-14" style={{ color: "var(--site-accent)" }} />
                <h2 className="text-2xl font-extrabold">התור נקבע! 🎉</h2>
                <p style={{ color: "var(--site-muted)" }}>
                  {name}, נתראה ב{dayLabel} בשעה {slot?.time}.
                  <br />
                  {businessName} מחכים לך.
                </p>
              </>
            ) : (
              <>
                <Hourglass className="h-14 w-14" style={{ color: "var(--site-accent)" }} />
                <h2 className="text-2xl font-extrabold">הבקשה נשלחה!</h2>
                <p style={{ color: "var(--site-muted)" }}>
                  {businessName} יאשרו את התור בהקדם.
                  <br />
                  מבוקש: {dayLabel} בשעה {slot?.time}.
                </p>
              </>
            )}
            <Link href={`/${slug}`} className={`site-btn site-btn-${design.buttonFill} mt-2 px-6 py-3 font-bold`}>
              חזרה לעמוד של {businessName}
            </Link>
          </div>
        )}

        <p className="mt-6 text-center text-xs opacity-60" style={{ color: "var(--site-muted)" }}>
          {autoConfirm ? "התור מאושר מיד עם הקביעה" : "התור ייקבע סופית לאחר אישור העסק"} · נוצר עם הילה ✨
        </p>
      </div>
    </div>
  );
}
