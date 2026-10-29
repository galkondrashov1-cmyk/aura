import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { SiteNav, CtaBand, Footer, ClaimField } from "@/components/marketing";
import { Showcase } from "@/components/marketing/showcase";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { templateContent } from "@/lib/templates";
import { TITLE_FX } from "@/lib/studio";
import { BACKGROUNDS } from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { PLANS, formatPrice } from "@/lib/plans";
import { BRAND } from "@/lib/brand";
import type { PageContent, PageDesign } from "@/lib/blocks";

// Static marketing page: rendered once at build time, served from the CDN.
export const dynamic = "force-static";

function Phone({ content, className }: { content: PageContent; className?: string }) {
  return (
    <div data-mode="vivid" dir="ltr" className={className}>
      <div className="pointer-events-none flex min-h-[1180px] w-[390px] origin-top-left scale-[0.728] flex-col select-none *:flex-1">
        <PageRenderer content={content} embedded thumbnail hideBadge />
      </div>
    </div>
  );
}

const SHOWCASE = [
  { id: "hebrew", name: "סטודיו" },
  { id: "cafe", name: "בית קפה" },
  { id: "creator", name: "יוצרים" },
  { id: "portfolio", name: "תיק עבודות" },
  { id: "coach", name: "מאמנת" },
  { id: "musician", name: "מוזיקה" },
];

// Same words, four Remix results — hand-picked so the page is stable.
const REMIX_LOOKS: Partial<PageDesign>[] = [
  { accent: "#F472B6", bgCustom: { type: "mesh", colors: ["#5b21b6", "#9d174d", "#1e1b4b"] }, titleFx: "aurora", headingFont: "rubik", font: "heebo", headingWeight: "bold", card: "glass-frost", buttonShape: "pill", section: "none" },
  { accent: "#FBBF24", bgCustom: { type: "linear", colors: ["#1c1917", "#422006"], angle: 160 }, titleFx: "chrome", headingFont: "frankruhl", font: "assistant", card: "solid-deep", buttonShape: "soft", section: "glass" },
  { accent: "#22D3EE", bgCustom: { type: "radial", colors: ["#083344", "#020617"] }, titleFx: "neon", headingFont: "karantina", font: "rubik", card: "neon-cyber", buttonShape: "sharp", section: "none" },
  { accent: "#B45309", bgCustom: { type: "linear", colors: ["#fdf6ec", "#f1e4cf"], angle: 160 }, titleFx: "highlight", headingFont: "suez", font: "assistant", headingWeight: "semibold", card: "solid-surface", buttonShape: "rounded", section: "solid" },
];

const remixContent = (design: Partial<PageDesign>): PageContent => ({
  design: { reveal: "none", ...design },
  blocks: [
    { id: "h", type: "hero", name: "נועה לוי", tagline: "צלמת · תל אביב", badge: "פנויה ל־2027" },
    { id: "l", type: "links", items: [
      { label: "הזמנת צילומים", url: "#", highlighted: true, icon: "📸" },
      { label: "תיק עבודות", url: "#", icon: "auto" },
    ] },
    { id: "s", type: "socials", iconStyle: "chip", items: [
      { platform: "instagram", url: "#" },
      { platform: "tiktok", url: "#" },
      { platform: "whatsapp", url: "#" },
    ] },
  ],
});

const STEPS = [
  { n: "01", title: "בוחרים תבנית", body: "תשע תבניות שהן עמודי נחיתה אמיתיים — לבית קפה, למאמנת, לסטודיו, ליוצרים." },
  { n: "02", title: "מעצבים בזמן אמת", body: "כל צבע, פונט, כפתור ותנועה משתנים מול העיניים. Remix ממציא מראה שלם בלחיצה." },
  { n: "03", title: "משתפים קישור אחד", body: `${BRAND.domain}/השם-שלכם — בביו, בסטורי, בחתימה, על כרטיס ביקור עם QR.` },
];

const FEATURES = [
  { title: "Remix", body: "מראה שלם ומדויק בלחיצה — צבעים, פונטים, כפתורים ותנועה. לא אהבתם? ביטול מחזיר." },
  { title: "עברית מהשורה הראשונה", body: "עמודים מימין לשמאל אוטומטית, פונטים בעברית, וטפסים וכפתורים שמדברים עברית למבקרים." },
  { title: "בלוקים לעסקים", body: "מחירון, המלצות עם כוכבים, מספרים שסופרים, מפה עם Waze, טפסים שנכנסים לתיבת פניות." },
  { title: "כפתור וואטסאפ צף", body: "נשאר בפינה כל הגלילה. לעסק קטן — זה הליד." },
  { title: "רקעים חיים", body: "משי ונוזל בזמן אמת, קונסטלציות שעוקבות אחרי העכבר, גחליליות ושלג." },
  { title: "פריסות של עמוד אמיתי", body: "כרטיס צף, מסך מפוצל, שער, פוסטר — לא רק רשימת קישורים." },
  { title: "נתונים בלי רעש", body: "צפיות, קליקים ואחוז הקלקה לכל קישור, מאיפה הגיעו ומאיזו מדינה. בוטים לא נספרים." },
  { title: "עמודים מהירים", body: "כל עמוד נבנה מראש ומוגש מהשרת הקרוב. אפקטים כבדים נטענים רק כשמשתמשים בהם." },
];

export default function Home() {
  const slides = SHOWCASE.map((s) => ({
    id: s.id,
    name: s.name,
    node: <Phone content={templateContent(s.id)} className="h-full w-full overflow-hidden" />,
  }));

  return (
    <div className="min-h-screen overflow-x-clip">
      <SiteNav />

      {/* ── Hero: the oversized type moment ── */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pt-10 pb-20 sm:px-8 lg:grid-cols-12 lg:pt-16">
        <div className="lg:col-span-7">
          <p className="kicker">עמודי נחיתה אישיים · בעברית</p>
          <h1 className="display-xl mt-5">
            <span className="wipe block">עמוד נחיתה אישי,</span>
            <span className="wipe wipe-2 block">
              בעיצוב <span className="hl">שאין לאף אחד</span>.
            </span>
          </h1>
          <p className="wipe wipe-3 mt-8 max-w-xl text-lg leading-relaxed text-text-muted">
            בוחרים תבנית, משנים כל צבע, פונט ותנועה, ומפרסמים. {FONTS.length} פונטים, {BACKGROUNDS.length} רקעים,{" "}
            {TITLE_FX.length - 1} אפקטים לכותרות — ובלי שורת קוד אחת.
          </p>
          <div className="mt-10 max-w-xl">
            <ClaimField />
            <p className="mt-3 text-sm text-text-muted">חינם לתמיד בחבילה הבסיסית · בלי כרטיס אשראי</p>
          </div>
        </div>

        <figure className="lg:col-span-5 lg:-mt-4">
          <Showcase slides={slides} />
          <figcaption className="mt-4 border-t border-text pt-2 text-xs text-text-muted">
            עמודים אמיתיים מתוך התבניות — לא צילומי מסך.
          </figcaption>
        </figure>
      </section>

      {/* ── Index: three steps as a table of contents ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="rule rule-in" />
              <p className="mt-4 font-display text-5xl font-black text-primary">{s.n}</p>
              <h2 className="mt-3 text-xl font-bold">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Remix: full-bleed ink band breaks the page ── */}
      <section className="bg-text py-20 text-bg">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="kicker !text-primary">Remix</p>
          <h2 className="display-l wipe-in mt-4 max-w-3xl">אותן מילים. ארבעה עמודים אחרים לגמרי.</h2>
          <p className="mt-5 max-w-2xl text-lg text-bg/70">
            לארבעת העמודים כאן יש בדיוק אותו תוכן. כל מראה הוא לחיצה אחת על Remix — וכל צבע, פונט וכפתור נשארים פתוחים
            לעריכה.
          </p>
        </div>
        <div className="mt-14 flex gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:mx-auto lg:max-w-7xl lg:justify-between lg:overflow-visible">
          {REMIX_LOOKS.map((d, i) => (
            <figure key={i} className="shrink-0">
              <div className="h-[420px] w-[226px] overflow-hidden rounded-[22px] border-[5px] border-[#2b2824]">
                <div data-mode="vivid" dir="ltr" className="h-full w-full overflow-hidden">
                  <div className="pointer-events-none flex min-h-[760px] w-[390px] origin-top-left scale-[0.55] flex-col select-none *:flex-1">
                    <PageRenderer content={remixContent(d)} embedded thumbnail hideBadge />
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 font-display text-sm text-bg/60">Remix · {String(i + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── Type specimen: title effects on a ruled sheet ── */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-l wipe-in max-w-2xl">כותרות עם אופי.</h2>
          <p className="max-w-sm text-text-muted">{TITLE_FX.length - 1} אפקטים לכותרות, חיים — אותו קוד שהעמוד שלכם מקבל.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 border-t border-s border-text sm:grid-cols-3 lg:grid-cols-4">
          {TITLE_FX.filter((f) => f.id !== "none").map((f, i) => (
            <div
              key={f.id}
              data-mode="vivid"
              data-tfx={f.id}
              className="flex h-36 flex-col justify-between border-e border-b border-text bg-[#0d0d0f] p-4 text-text"
              style={{ ["--primary" as string]: ["#FF5A1F", "#F472B6", "#38BDF8", "#FBBF24", "#A3E635", "#FB7185"][i % 6] }}
            >
              <span className="text-[11px] text-white/50">{String(i + 1).padStart(2, "0")}</span>
              <span className="pg-title text-center [--h1:2.1rem]">
                <span className="tfx" data-text="שלום">
                  שלום
                </span>
              </span>
              <span className="text-[11px] text-white/60">{f.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's inside: an editorial list, not an icon grid ── */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="display-l wipe-in lg:sticky lg:top-10">מה יש בפנים.</h2>
        </div>
        <ol className="lg:col-span-8">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-text py-6 last:border-b">
              <span className="font-display text-2xl font-black text-primary">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="mt-1.5 max-w-2xl leading-relaxed text-text-muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Pricing teaser: three ruled columns ── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-l wipe-in">במחיר של כוס קפה בחודש.</h2>
          <p className="max-w-sm text-text-muted">בתקופת הגישה המוקדמת כל החבילות בחינם. כאן המחירים העתידיים, בחיוב שנתי.</p>
        </div>
        <div className="mt-10 grid border-t border-text md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.id} className="flex flex-col border-b border-text py-8 md:border-b-0 md:px-8 md:first:ps-0 md:[&:not(:last-child)]:border-e">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-3xl font-black">{p.name}</h3>
                {p.popular && <span className="bg-primary px-2 py-0.5 text-xs font-medium text-primary-ink">הכי נבחר</span>}
              </div>
              <p className="mt-6 font-display text-5xl font-black">
                {p.yearlyPerMonth === 0 ? "₪0" : formatPrice(p.yearlyPerMonth)}
                <span className="ms-1 font-sans text-base font-normal text-text-muted">{p.yearlyPerMonth ? "לחודש" : "לתמיד"}</span>
              </p>
              <p className="mt-2 text-text-muted">{p.tagline}</p>
              <ul className="mt-6 flex-1 space-y-2 text-[0.95rem]">
                {p.highlights.slice(0, 5).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-2.5 size-1.5 shrink-0 bg-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/pricing" className={`${buttonClasses("secondary", "md")} mt-8`}>
          השוו את כל היכולות ←
        </Link>
      </section>

      <CtaBand />
      <Footer />
    </div>
  );
}
