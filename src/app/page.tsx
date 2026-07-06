import Link from "next/link";
import {
  CalendarCheck,
  Paintbrush,
  Sparkles,
  Smartphone,
  ShieldCheck,
  BarChart3,
  Check,
} from "lucide-react";
import { HilaLogo } from "@/components/ui";
import { PLANS, priceLabel } from "@/lib/plans";
import { getSession } from "@/lib/session";

const FEATURES = [
  {
    icon: Paintbrush,
    title: "ערימות של אפשרויות עיצוב",
    body: "ערכות מוכנות, רקעים חיים, הילות זוהרות, פונטים עבריים וכפתורים בכל צורה — בלי לדעת לעצב.",
  },
  {
    icon: CalendarCheck,
    title: "זימון תורים 24/7",
    body: "הלקוחות קובעים תור לבד מהנייד — המערכת מציגה רק שעות פנויות אמיתיות לפי היומן שלך.",
  },
  {
    icon: Smartphone,
    title: "מושלם בנייד",
    body: "העמוד שלך נראה מדהים בכל מסך — בדיוק איפה שהלקוחות שלך נמצאים.",
  },
  {
    icon: ShieldCheck,
    title: "אימות לקוח ב־SMS",
    body: "כל תור מאומת בקוד חד־פעמי, כדי שלא יגיעו אליך תורים מזויפים. (דמו בשלב זה)",
  },
  {
    icon: BarChart3,
    title: "סטטיסטיקות בזמן אמת",
    body: "כמה נכנסו, כמה קבעו תור — הכל בלוח הבקרה שלך.",
  },
  {
    icon: Sparkles,
    title: "מוכן בדקות",
    body: "נרשמים, ממלאים כמה פרטים, בוחרים עיצוב — והעמוד באוויר עם כתובת אישית.",
  },
];

const STEPS = [
  { n: "1", title: "נרשמים בחינם", body: "שם העסק, אימייל וסיסמה — זהו." },
  { n: "2", title: "מעצבים את העמוד", body: "בוחרים ערכה, רקע ופונט. רואים הכל בתצוגה חיה." },
  { n: "3", title: "מפרסמים ומקבלים תורים", body: "משתפים את הקישור — והלקוחות מתחילים לקבוע." },
];

export default async function HomePage() {
  const session = await getSession();
  return (
    <div className="min-h-dvh">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-night/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <HilaLogo />
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <a href="#features" className="hidden px-3 py-2 text-ink-2 hover:text-ink sm:block">
              מה מקבלים
            </a>
            <a href="#pricing" className="hidden px-3 py-2 text-ink-2 hover:text-ink sm:block">
              מחירים
            </a>
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-halo px-4 py-2 font-semibold text-night hover:bg-halo-2"
              >
                ללוח הבקרה
              </Link>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-ink-2 hover:text-ink">
                  התחברות
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-halo px-4 py-2 font-semibold text-night hover:bg-halo-2"
                >
                  פתיחת חשבון
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="halo-orb right-[8%] top-[12%] h-72 w-72" style={{ background: "#f0b429" }} />
          <div className="halo-orb left-[6%] top-[35%] h-80 w-80" style={{ background: "#8b7cf6", animationDelay: "-6s" }} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:pt-24">
          <div className="relative mx-auto mb-8 h-36 w-36">
            <div className="halo-ring absolute inset-0 rounded-full" />
            <div className="absolute inset-3 rounded-full bg-night" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl">✨</div>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            ההילה של <span className="glow-text text-halo">העסק שלך</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-2 sm:text-xl">
            עמוד מעוצב לעסק + זימון תורים ופגישות אונליין — בלי מעצב, בלי מתכנת, בדקות.
            מתחילים בחינם.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-2xl bg-halo px-7 py-3.5 text-base font-bold text-night shadow-[0_0_35px_rgba(240,180,41,0.35)] transition hover:bg-halo-2 hover:shadow-[0_0_50px_rgba(240,180,41,0.5)]"
            >
              יוצרים עמוד בחינם
            </Link>
            <a
              href="#pricing"
              className="rounded-2xl border border-line px-7 py-3.5 text-base font-semibold text-ink transition hover:bg-white/5"
            >
              לחבילות ומחירים
            </a>
          </div>
          <p className="mt-4 text-sm text-ink-2">
            חינם לתמיד לעמוד נחיתה · ללא כרטיס אשראי
          </p>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold">כל מה שעסק קטן צריך מאתר</h2>
        <p className="mt-3 text-center text-ink-2">עמוד אחד (או שניים) שעובד קשה בשבילך.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 transition hover:border-halo/30">
              <f.icon className="h-8 w-8 text-halo" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-line bg-night-2/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">איך זה עובד?</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-halo/15 text-xl font-extrabold text-halo">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold">מחירים פשוטים, בלי הפתעות</h2>
        <p className="mt-3 text-center text-ink-2">מתחילים בחינם ומשדרגים רק כשצריך.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`card relative flex flex-col p-7 ${p.popular ? "border-halo/50 shadow-[0_0_40px_rgba(240,180,41,0.12)]" : ""}`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-6 rounded-full bg-halo px-3 py-1 text-xs font-bold text-night">
                  הכי פופולרי
                </span>
              )}
              <h3 className="text-xl font-extrabold" style={{ color: p.accent }}>
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-ink-2">{p.tagline}</p>
              <div className="mt-5 text-3xl font-extrabold">
                {p.monthly === 0 ? "₪0" : `₪${p.monthly.toFixed(2)}`}
                {p.monthly > 0 && <span className="text-sm font-medium text-ink-2"> / חודש</span>}
              </div>
              <p className="mt-1 text-xs text-ink-2">{priceLabel(p)}</p>
              <ul className="mt-6 flex flex-col gap-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.accent }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 rounded-xl px-4 py-3 text-center text-sm font-bold transition ${
                  p.popular
                    ? "bg-halo text-night hover:bg-halo-2"
                    : "border border-line text-ink hover:bg-white/5"
                }`}
              >
                {p.monthly === 0 ? "מתחילים בחינם" : `בוחרים ב${p.name}`}
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink-2">
          התשלומים בשלב הדמו — שדרוג מיידי ללא חיוב אמיתי.
        </p>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-line">
        <div className="pointer-events-none absolute inset-0">
          <div className="halo-orb left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2" style={{ background: "#f0b429", opacity: 0.25 }} />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">העסק שלך ראוי להילה משלו</h2>
          <p className="mt-4 text-ink-2">שתי דקות מהרשמה לעמוד חי. באמת.</p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-2xl bg-halo px-8 py-4 text-base font-bold text-night shadow-[0_0_35px_rgba(240,180,41,0.35)] transition hover:bg-halo-2"
          >
            פותחים חשבון בחינם
          </Link>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-sm text-ink-2 sm:flex-row sm:justify-between">
          <HilaLogo size={22} />
          <p>© {new Date().getFullYear()} הילה — ההילה של העסק שלך</p>
        </div>
      </footer>
    </div>
  );
}
