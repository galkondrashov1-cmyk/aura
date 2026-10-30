import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { SiteNav, CtaBand, Footer, ClaimField } from "@/components/marketing";
import { BlockDemo, Phone } from "@/components/marketing/phone";
import { HoursView } from "@/components/renderer/hours-view";
import { templateContent, TEMPLATES } from "@/lib/templates";
import { BACKGROUNDS, FULL_THEMES } from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { PLANS, formatPrice } from "@/lib/plans";
import { strings } from "@/lib/i18n";
import type { Block, DayHours, PageContent, PageDesign } from "@/lib/blocks";

// Static marketing page: rendered once at build time, served from the CDN.
export const dynamic = "force-static";

const HE = strings("he");
const theme = (id: string): PageDesign => ({ ...FULL_THEMES.find((t) => t.id === id)?.design, reveal: "none" });
const page = (design: PageDesign, ...blocks: Block[]): PageContent => ({ design, blocks });

const day = (from: string, to: string): DayHours => ({ from, to });
const CAFE_HOURS: DayHours[] = [day("07:00", "19:00"), day("07:00", "19:00"), day("07:00", "19:00"), day("07:00", "19:00"), day("07:00", "19:00"), day("07:00", "15:00"), day("09:00", "18:00")];

// Same words, four Remix results, hand-picked so the page is stable.
const REMIX_LOOKS: PageDesign[] = [
  { accent: "#F472B6", bgCustom: { type: "mesh", colors: ["#5b21b6", "#9d174d", "#1e1b4b"] }, titleFx: "aurora", headingFont: "rubik", font: "heebo", headingWeight: "bold", card: "glass-frost", buttonShape: "pill", section: "none" },
  { accent: "#FBBF24", bgCustom: { type: "linear", colors: ["#1c1917", "#422006"], angle: 160 }, titleFx: "none", headingFont: "suez", font: "assistant", card: "solid-deep", buttonShape: "soft", section: "glass" },
  { accent: "#22D3EE", bgCustom: { type: "radial", colors: ["#083344", "#020617"] }, titleFx: "none", headingFont: "karantina", font: "rubik", card: "neon-cyber", buttonShape: "sharp", section: "none" },
  { accent: "#B45309", bgCustom: { type: "linear", colors: ["#fdf6ec", "#f1e4cf"], angle: 160 }, titleFx: "none", headingFont: "secular", font: "assistant", card: "solid-surface", buttonShape: "rounded", section: "solid" },
];

const remix = (design: PageDesign) =>
  page(
    { reveal: "none", ...design },
    { id: "h", type: "hero", name: "נועה לוי", tagline: "צלמת · תל אביב", badge: "פנויה ל־2027" },
    { id: "l", type: "links", items: [{ label: "הזמנת צילומים", url: "#", highlighted: true, icon: "📸" }, { label: "תיק עבודות", url: "#", icon: "auto" }] },
    { id: "s", type: "socials", iconStyle: "chip", items: [{ platform: "instagram", url: "#" }, { platform: "tiktok", url: "#" }, { platform: "whatsapp", url: "#" }] },
  );

const LOCAL: { title: string; body: string; demo?: PageContent; chips?: string[] }[] = [
  {
    title: "שעות פתיחה",
    body: "המבקרים רואים אם אתם פתוחים עכשיו, לפי שעון ישראל. גם הפסקת צהריים וגם יום שישי קצר.",
    demo: page(theme("white-city"), { id: "h", type: "hours", heading: "שעות פתיחה", days: [day("09:00", "18:00"), day("09:00", "18:00"), day("09:00", "18:00"), { from: "09:00", to: "13:00", from2: "16:00", to2: "19:00" }, day("09:00", "18:00"), day("08:30", "14:00"), { closed: true }] }),
  },
  {
    title: "ביט, פייבוקס ו־Waze",
    body: "מדביקים קישור לתשלום או לניווט, והכפתור מקבל את האייקון הנכון לבד.",
    demo: page(theme("jaffa-night"), {
      id: "l",
      type: "links",
      items: [
        { label: "תשלום בביט", url: "https://www.bitpay.co.il/app/me/demo", icon: "auto" },
        { label: "תשלום בפייבוקס", url: "https://payboxapp.page.link/demo", icon: "auto" },
        { label: "ניווט אלינו ב־Waze", url: "https://waze.com/ul?q=demo", icon: "auto" },
      ],
    }),
  },
  {
    title: "כרטיס ביקור לטלפון",
    body: "לחיצה אחת, והמבקר שומר אתכם באנשי הקשר עם הטלפון, המייל והקישור לעמוד.",
    demo: page(theme("dead-sea"), { id: "c", type: "contact", name: "נועה לוי", role: "צלמת", org: "סטודיו נועה", phone: "050-000-0000", email: "noa@example.com" }),
  },
  {
    title: "תפריט נגישות",
    body: "כפתור צף למבקרים, בכל החבילות. מומלץ לכל עסק שמקבל קהל.",
    chips: ["הגדלת טקסט", "ניגודיות גבוהה", "הדגשת קישורים", "עצירת אנימציות", "גופן קריא"],
  },
];

const PICKS = ["creator", "coach", "portfolio", "musician"];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteNav />

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-24 sm:px-8 lg:grid-cols-[1fr_auto] lg:pt-20">
        <div className="max-w-xl">
          <h1 className="display-xl">עמוד אחד לכל הקישורים, השעות והפרטים שלכם</h1>
          <p className="mt-6 text-lg leading-relaxed text-text-muted">
            בונים בעברית, בוחרים מראה ומשתפים כתובת אחת. מתאים לעסק קטן, לפרילנסרים וליוצרים, בלי קוד ובלי מעצב.
          </p>
          <div className="mt-9">
            <ClaimField />
            <p className="mt-3 text-sm text-text-muted">חינם, בלי כרטיס אשראי.</p>
          </div>
        </div>

        <figure className="relative mx-auto lg:mx-0">
          <Phone content={templateContent("cafe")} />
          <div className="mt-4 w-[280px] lg:absolute lg:-end-32 lg:bottom-16 lg:mt-0 lg:w-64 [&>div]:bg-surface [&>div]:shadow-2xl [&>div]:shadow-black/50">
            <HoursView b={{ id: "hero-hours", type: "hours", heading: "קפה טקס הבוקר", days: CAFE_HOURS }} t={HE} />
          </div>
          <figcaption className="sr-only">עמוד לדוגמה של בית קפה, עם שעות פתיחה שמתעדכנות לפי השעה</figcaption>
        </figure>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="display-l">אותו תוכן, ארבעה מראות</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted">
            Remix מחליף צבעים, פונטים, כפתורים ותנועה בלחיצה, ואפשר להמשיך לשנות כל פרט ביד. יש {FONTS.length} פונטים,{" "}
            {FULL_THEMES.length} ערכות עיצוב ו־{BACKGROUNDS.length} רקעים לבחור מהם.
          </p>
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:justify-between">
          {REMIX_LOOKS.map((d, i) => (
            <Phone key={i} content={remix(d)} width={232} height={460} className="rounded-[28px]" />
          ))}
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="display-l">בנוי לעסקים בישראל</h2>
          <div className="mt-12 divide-y divide-border border-y border-border">
            {LOCAL.map((f) => (
              <div key={f.title} className="grid gap-6 py-10 md:grid-cols-2 md:items-center md:gap-12">
                <div>
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-text-muted">{f.body}</p>
                </div>
                {f.demo && <BlockDemo content={f.demo} className="w-full max-w-md md:justify-self-end" />}
                {f.chips && (
                  <ul className="flex max-w-md flex-wrap gap-2 md:justify-self-end">
                    {f.chips.map((c) => (
                      <li key={c} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display-l">תבניות להתחיל מהן</h2>
              <p className="mt-3 text-text-muted">{TEMPLATES.length} תבניות, כל אחת עמוד שלם עם תוכן לדוגמה בעברית.</p>
            </div>
            <Link href="/signup" className={buttonClasses("secondary", "md")}>
              לכל התבניות
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {TEMPLATES.filter((t) => PICKS.includes(t.id)).map((t) => (
              <figure key={t.id}>
                <Phone content={templateContent(t.id)} width={232} height={460} className="mx-auto max-w-full rounded-[28px]" />
                <figcaption className="mt-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="mt-1 text-sm text-text-muted">{t.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="display-l">מחירים</h2>
          <p className="mt-3 max-w-xl text-text-muted">בתקופת הגישה המוקדמת כל החבילות בחינם. אלה המחירים שיחולו אחר כך, בחיוב שנתי.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.id} className={`flex flex-col rounded-xl border bg-surface p-6 ${p.popular ? "border-primary" : "border-border"}`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.popular && <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-ink">הכי נבחר</span>}
                </div>
                <p className="mt-4 text-4xl font-semibold">
                  {p.yearlyPerMonth === 0 ? "₪0" : formatPrice(p.yearlyPerMonth)}
                  <span className="ms-1.5 text-sm font-normal text-text-muted">{p.yearlyPerMonth ? "לחודש" : "לתמיד"}</span>
                </p>
                <p className="mt-2 text-sm text-text-muted">{p.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.highlights.slice(0, 5).map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link href="/pricing" className={`${buttonClasses("ghost", "md")} mt-6 -ms-5`}>
            השוואה מלאה בין החבילות ←
          </Link>
        </div>
      </section>

      <CtaBand />
      <Footer />
    </div>
  );
}
