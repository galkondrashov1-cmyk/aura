import Link from "next/link";
import { HilaLogo } from "@/components/ui";
import { HeroGlow, HaloStage } from "@/components/hero-halo";
import {
  HaloBrush,
  HaloCalendar,
  HaloChart,
  HaloClock,
  HaloHeart,
  HaloPhone,
  HaloShield,
  HaloSpark,
} from "@/components/halo-icons";
import { THEMES, background } from "@/lib/design";
import { PLANS } from "@/lib/plans";
import { getSession } from "@/lib/session";

const PROFESSIONS = [
  "מספרות", "קוסמטיקאיות", "מאמני כושר", "קליניקות", "מטפלים", "צלמים",
  "מורים פרטיים", "עורכי דין", "ברברשופים", "סטודיו יוגה", "מעצבות ציפורניים", "יועצים",
];

const FEATURES = [
  {
    icon: HaloBrush,
    title: "עיצוב שלא מתנצל",
    body: "14 ערכות, רקעים חיים שנושמים, פונטים עבריים יפים באמת. בוחרים, מזיזים, מתאהבים — בלי לדעת מה זה פוטושופ.",
  },
  {
    icon: HaloCalendar,
    title: "היומן מתמלא לבד",
    body: "לקוחה נכנסת בעשר בלילה, בוחרת שעה, מאמתת בקוד — ולך נוסף תור. בלי טלפונים, בלי ״רגע, אני בודקת ביומן״.",
  },
  {
    icon: HaloShield,
    title: "אפס תורים פיקטיביים",
    body: "כל תור מאומת בקוד חד־פעמי לנייד של הלקוח. מי שקבע — באמת קבע.",
  },
  {
    icon: HaloPhone,
    title: "נולד לתוך הנייד",
    body: "הלקוחות שלך גוללים בטלפון — והעמוד שלך נראה שם כמו מיליון דולר. גם בטאבלט. גם במחשב של אמא.",
  },
  {
    icon: HaloChart,
    title: "מספרים שמחמיאים",
    body: "כמה נכנסו, כמה קבעו, מאיפה הגיעו. בלי אקסלים — פשוט נכנסים ורואים.",
  },
  {
    icon: HaloClock,
    title: "3 דקות. באמת.",
    body: "עד שהקפה שלך מתקרר, יש לך עמוד באוויר עם כתובת משלך. מדדנו.",
  },
];

const STEPS = [
  { title: "מספרים לנו מי אתם", body: "שם, עסק, ומה אתם עושים. פחות משאלון בקופת חולים." },
  { title: "בוחרים את האור", body: "ערכה, רקע, פונט — ורואים הכל קורה בתצוגה חיה." },
  { title: "משתפים קישור אחד", body: "בסטורי, בוואטסאפ, בביו. מכאן — הלקוחות כבר לבד." },
];

const FAQ = [
  {
    q: "זה באמת בחינם?",
    a: "כן. עמוד נחיתה עם עיצוב בסיסי — חינם לתמיד, בלי כרטיס אשראי ובלי אותיות קטנות. משלמים רק אם רוצים את כל סטודיו העיצוב (₪9.90) או זימון תורים (₪49.99).",
  },
  {
    q: "אני צריך לדעת לבנות אתרים?",
    a: "ממש לא. אם אתם יודעים לבחור פילטר לסטורי, אתם יודעים לבנות עמוד בהילה. הכל בעברית, הכל בלחיצות.",
  },
  {
    q: "איך הלקוחות שלי קובעים תור?",
    a: "הם נכנסים לעמוד שלכם, בוחרים שירות ושעה פנויה (המערכת מציגה רק שעות אמיתיות מהיומן שלכם), מאמתים קוד בנייד — וזהו. אתם יכולים לבחור אישור אוטומטי או ידני.",
  },
  {
    q: "מה עם ביטולים?",
    a: "כל לקוח מקבל קישור ביטול אישי, ואתם יכולים לבטל או לאשר כל תור מהיומן. בלי דרמות.",
  },
];

const PLAN_EXTRAS: Record<string, { nickname: string; ring: number; note: string }> = {
  FREE: { nickname: "ניצוץ", ring: 56, note: "להתחיל להאיר" },
  DESIGN: { nickname: "זוהר", ring: 76, note: "כל סטודיו העיצוב" },
  BUSINESS: { nickname: "הילה מלאה", ring: 100, note: "העסק עובד בשבילך" },
};

export default async function HomePage() {
  const session = await getSession();
  return (
    <div className="min-h-dvh overflow-x-clip">
      {/* ─── nav ─── */}
      <header className="sticky top-0 z-40 border-b border-line bg-night/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" aria-label="הילה — דף הבית">
            <HilaLogo />
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <a href="#how" className="hidden px-3 py-2 text-ink-2 transition hover:text-halo sm:block">
              איך זה עובד
            </a>
            <a href="#features" className="hidden px-3 py-2 text-ink-2 transition hover:text-halo sm:block">
              מה מקבלים
            </a>
            <a href="#pricing" className="hidden px-3 py-2 text-ink-2 transition hover:text-halo sm:block">
              מחירים
            </a>
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-halo px-5 py-2 font-bold text-night transition hover:bg-halo-2 hover:shadow-[0_0_24px_rgba(240,180,41,0.45)]"
              >
                ללוח הבקרה
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-ink-2 transition hover:text-ink">
                  התחברות
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-halo px-5 py-2 font-bold text-night transition hover:bg-halo-2 hover:shadow-[0_0_24px_rgba(240,180,41,0.45)]"
                >
                  מתחילים להאיר
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ─── hero ─── */}
      <HeroGlow>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-14 sm:pt-20 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-halo/25 bg-halo/8 px-4 py-1.5 text-sm font-semibold text-halo">
              <HaloSpark size={18} />
              הבית הדיגיטלי של עסקים שמאירים
            </p>
            <h1 className="text-[2.6rem] font-extrabold leading-[1.12] sm:text-6xl">
              לכל עסק יש אור.
              <br />
              אנחנו שמים לו{" "}
              <span className="word-halo">הילה.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-2 lg:mx-0">
              עמוד מהמם לעסק שלך + לקוחות שקובעים תור לבד, גם כשאת ישנה.
              בלי מעצב, בלי מתכנת — <b className="text-ink">בשלוש דקות זה באוויר.</b>
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href="/signup"
                className="group relative rounded-full bg-halo px-8 py-4 text-base font-extrabold text-night transition hover:bg-halo-2"
              >
                <span className="absolute -inset-1 rounded-full border border-halo/40 opacity-0 transition group-hover:opacity-100 group-hover:-inset-2" />
                יוצרים הילה בחינם
              </Link>
              <a
                href="#showcase"
                className="rounded-full border border-line px-8 py-4 text-base font-semibold text-ink transition hover:border-halo/40 hover:text-halo"
              >
                תראו לי דוגמה
              </a>
            </div>
            <p className="mt-4 text-sm text-ink-2">
              חינם לתמיד · בלי כרטיס אשראי · עברית מלאה
            </p>
          </div>
          <HaloStage />
        </section>
      </HeroGlow>

      {/* ─── professions marquee ─── */}
      <section className="border-y border-line bg-night-2/40 py-5" aria-label="מי כבר מאיר איתנו">
        <div className="overflow-hidden" dir="ltr">
          <div className="marquee">
            {[...PROFESSIONS, ...PROFESSIONS].map((p, i) => (
              <span key={i} className="flex items-center gap-2.5 text-sm font-semibold text-ink-2" dir="rtl">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-[1.5px] border-halo/70 shadow-[0_0_6px_rgba(240,180,41,0.6)]" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── how it works ─── */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">
          שלושה צעדים, ויש לך <span className="text-shimmer">הילה</span>
        </h2>
        <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
          {/* the glowing thread connecting the steps */}
          <div className="absolute right-[16%] left-[16%] top-8 hidden h-px bg-gradient-to-l from-halo/0 via-halo/50 to-halo/0 sm:block" />
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="step-ring relative mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <span className="absolute inset-1 flex items-center justify-center rounded-full bg-night text-xl font-extrabold text-halo">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-56 text-sm leading-relaxed text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── features ─── */}
      <section id="features" className="border-t border-line bg-night-2/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">מה מסתתר מתחת להילה</h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-ink-2">
            בנינו את מה שעסק קטן באמת צריך — וזרקנו את כל השאר.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="lift-card group card p-6">
                <f.icon size={40} className="text-ink" />
                <h3 className="mt-4 text-lg font-bold transition group-hover:text-halo">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── design showcase ─── */}
      <section id="showcase" className="mx-auto max-w-6xl px-4 py-24">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">עמוד אחד. אינסוף אורות.</h2>
        <p className="mx-auto mt-3 max-w-md text-center text-ink-2">
          כל אלה ערכות אמיתיות מהסטודיו — לחיצה אחת וכל העמוד מחליף אווירה.
        </p>
        <div className="mt-12 flex gap-4 overflow-x-auto pb-4 thin-scroll" dir="ltr">
          {THEMES.filter((t) => ["hila-night", "shkia", "or", "yam", "pastel", "melech", "zohar", "layla"].includes(t.id)).map((t, i) => {
            const bg = background(t.design.background);
            const dark = bg.mode === "dark";
            return (
              <div
                key={t.id}
                dir="rtl"
                className="lift-card w-40 shrink-0 rounded-2xl border border-line p-3"
                style={{ background: bg.css, transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)` }}
              >
                <div
                  className="mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full border text-lg"
                  style={{ borderColor: t.design.accent, boxShadow: `0 0 10px ${t.design.accent}55` }}
                >
                  ✨
                </div>
                <p className="mt-2 text-center text-xs font-bold" style={{ color: dark ? "#f2f3f5" : "#1c1917" }}>
                  {t.name}
                </p>
                <div className="mt-2 flex flex-col gap-1">
                  <div className="h-5 rounded-md" style={{ background: t.design.accent, borderRadius: t.design.button === "sharp" ? 3 : t.design.button === "pill" ? 99 : 8, opacity: 0.92 }} />
                  <div className="h-5 rounded-md border" style={{ borderColor: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)", borderRadius: t.design.button === "sharp" ? 3 : t.design.button === "pill" ? 99 : 8 }} />
                </div>
                <p className="mt-2 text-center text-[9px]" style={{ color: dark ? "rgba(242,243,245,0.5)" : "rgba(28,25,23,0.5)" }}>
                  נוצר עם הילה ✨
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── pricing ─── */}
      <section id="pricing" className="border-t border-line bg-night-2/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">כמה אור מגיע לעסק שלך?</h2>
          <p className="mt-3 text-center text-ink-2">מתחילים בניצוץ. גדלים להילה מלאה.</p>
          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => {
              const extra = PLAN_EXTRAS[p.id];
              return (
                <div
                  key={p.id}
                  className={`lift-card card relative flex flex-col p-7 pt-16 ${p.popular ? "border-halo/50 shadow-[0_0_50px_-12px_rgba(240,180,41,0.35)]" : ""}`}
                >
                  {/* the plan's halo — bigger plan, bigger ring */}
                  <div
                    className="plan-halo absolute -top-9 right-7"
                    style={{
                      width: extra.ring,
                      height: extra.ring * 0.42,
                      borderRadius: "50%",
                      background: `conic-gradient(from 90deg, transparent, ${p.accent}, #ffe08a, ${p.accent}, transparent)`,
                      transform: "rotate(-6deg)",
                      filter: `drop-shadow(0 0 10px ${p.accent}66)`,
                    }}
                  />
                  {p.popular && (
                    <span className="absolute left-6 top-5 rounded-full bg-halo/15 px-3 py-1 text-xs font-bold text-halo">
                      הבחירה של רוב העסקים
                    </span>
                  )}
                  <p className="text-sm font-semibold text-ink-2">{extra.note}</p>
                  <h3 className="mt-1 text-2xl font-extrabold" style={{ color: p.accent }}>
                    {extra.nickname}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-ink-2">חבילת {p.name}</p>
                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold">{p.monthly === 0 ? "₪0" : `₪${p.monthly.toFixed(2)}`}</span>
                    <span className="text-sm text-ink-2">{p.monthly === 0 ? "לתמיד" : "/ חודש"}</span>
                  </div>
                  <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.5px]"
                          style={{ borderColor: p.accent, boxShadow: `0 0 6px ${p.accent}88` }}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`mt-8 rounded-full px-4 py-3.5 text-center text-sm font-extrabold transition ${
                      p.popular
                        ? "bg-halo text-night hover:bg-halo-2 hover:shadow-[0_0_24px_rgba(240,180,41,0.45)]"
                        : "border border-line text-ink hover:border-halo/40 hover:text-halo"
                    }`}
                  >
                    {p.monthly === 0 ? "מתחילים בחינם" : `אני רוצה ${extra.nickname}`}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-ink-2">
            בשלב הדמו השדרוג מיידי וללא חיוב אמיתי · מבטלים מתי שרוצים, ההילה נשארת עד סוף החודש
          </p>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="mx-auto max-w-3xl px-4 py-24">
        <h2 className="text-center text-3xl font-extrabold">שאלות ששואלים אותנו</h2>
        <div className="mt-10 flex flex-col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group card overflow-hidden p-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-bold transition hover:text-halo [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="inline-block h-3 w-3 shrink-0 rounded-full border-[1.5px] border-halo/70 shadow-[0_0_6px_rgba(240,180,41,0.5)] transition group-open:bg-halo" />
              </summary>
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── final CTA ─── */}
      <section className="relative overflow-hidden border-t border-line">
        {/* a giant halo rising behind the CTA like a sunrise */}
        <div
          className="pointer-events-none absolute left-1/2 top-full h-[560px] w-[860px] -translate-x-1/2 -translate-y-[38%] rounded-[50%]"
          style={{
            border: "3px solid rgba(240,180,41,0.65)",
            boxShadow: "0 0 60px rgba(240,180,41,0.5), inset 0 0 80px rgba(240,180,41,0.25)",
            filter: "blur(1px)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-full h-[560px] w-[860px] -translate-x-1/2 -translate-y-[30%] rounded-[50%] opacity-40 blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(240,180,41,0.55), transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-32 pt-24 text-center">
          <HaloHeart size={44} className="mx-auto text-halo" />
          <h2 className="mt-5 text-3xl font-extrabold leading-snug sm:text-5xl">
            העסק שלך כבר מאיר.
            <br />
            <span className="text-shimmer">מגיעה לו הילה.</span>
          </h2>
          <Link
            href="/signup"
            className="mt-10 inline-block rounded-full bg-halo px-10 py-4.5 text-lg font-extrabold text-night shadow-[0_0_40px_rgba(240,180,41,0.4)] transition hover:bg-halo-2 hover:shadow-[0_0_60px_rgba(240,180,41,0.6)]"
          >
            יוצרים הילה — בחינם
          </Link>
          <p className="mt-4 text-sm text-ink-2">3 דקות, קפה ביד, והעמוד באוויר ✨</p>
        </div>
      </section>

      {/* ─── footer ─── */}
      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-sm text-ink-2 sm:flex-row sm:justify-between">
          <HilaLogo size={24} />
          <p>נבנה עם המון אור בישראל 🇮🇱 · © {new Date().getFullYear()} הילה</p>
          <div className="flex gap-4">
            <a href="#pricing" className="transition hover:text-halo">מחירים</a>
            <a href="#features" className="transition hover:text-halo">מה מקבלים</a>
            <Link href="/signup" className="transition hover:text-halo">הרשמה</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
