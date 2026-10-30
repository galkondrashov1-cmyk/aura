// The full "what does each plan include" table. Every number is computed from
// the real feature lists (fonts, backgrounds, effects, blocks…), so the
// pricing page can never promise something the product doesn't do.
import { BRAND } from "@/lib/brand";
import { BACKGROUNDS, BG_FX, CARD_STYLES, FULL_THEMES, bgCategoryTier, bgFxCategoryTier, cardCategoryTier, fontCategoryTier } from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { TEMPLATES } from "@/lib/templates";
import { caps, PLAN_RANK, type Plan } from "@/lib/plans";
import {
  BLOCK_TIER,
  CURSORS,
  HERO_LAYOUTS,
  LIVE_BGS,
  PAGE_LAYOUTS,
  REVEALS,
  SECTION_STYLES,
  TITLE_FX,
  type Choice,
} from "@/lib/studio";
import { BLOCK_META } from "@/components/builder/block-meta";
import { TYPE_FX } from "@/lib/typing";

/** true = included, false = not, string = included with this detail. */
export type Cell = boolean | string;
export type MatrixRow = { label: string; hint?: string; cells: Record<Plan, Cell> };
export type MatrixGroup = { title: string; rows: MatrixRow[] };

const TIERS: Plan[] = ["FREE", "PLUS", "PRO"];
const upTo = (tier: Plan, plan: Plan) => PLAN_RANK[tier] <= PLAN_RANK[plan];

/** How many of `items` a plan can use. */
function countFor<T>(items: T[], tierOf: (t: T) => Plan): Record<Plan, number> {
  return Object.fromEntries(TIERS.map((p) => [p, items.filter((i) => upTo(tierOf(i), p)).length])) as Record<Plan, number>;
}

const realChoices = (list: Choice[]) => list.filter((c) => c.id !== "none");

function counts(items: Record<Plan, number>, unit = ""): Record<Plan, Cell> {
  return Object.fromEntries(TIERS.map((p) => [p, items[p] > 0 ? `${items[p]}${unit}` : false])) as Record<Plan, Cell>;
}

function flag(test: (p: Plan) => boolean, detail?: (p: Plan) => string): Record<Plan, Cell> {
  return Object.fromEntries(TIERS.map((p) => [p, test(p) ? (detail?.(p) ?? true) : false])) as Record<Plan, Cell>;
}

const blockNames = (tier: Plan) =>
  (Object.keys(BLOCK_TIER) as (keyof typeof BLOCK_TIER)[])
    .filter((t) => BLOCK_TIER[t] === tier && t !== "hero")
    .map((t) => BLOCK_META[t].label);

export function planMatrix(): MatrixGroup[] {
  const c = { FREE: caps("FREE"), PLUS: caps("PLUS"), PRO: caps("PRO") };
  const pages = (p: Plan) => (c[p].maxPages === Infinity ? "ללא הגבלה" : String(c[p].maxPages));
  const free = blockNames("FREE");
  const plus = blockNames("PLUS");
  const pro = blockNames("PRO");

  return [
    {
      title: "עמודים",
      rows: [
        { label: "עמודים", cells: { FREE: pages("FREE"), PLUS: pages("PLUS"), PRO: pages("PRO") } },
        { label: "הכתובת שלכם", hint: `${BRAND.domain}/noa, ולעמודים נוספים ${BRAND.domain}/noa/page`, cells: flag(() => true) },
        { label: "תבניות פתיחה", hint: "נגיעות פרימיום אפשר לנסות בחינם בעורך", cells: flag(() => true, () => `כל ה־${TEMPLATES.length}`) },
        { label: "Remix — מראה חדש בלחיצה", cells: flag(() => true) },
        { label: "עברית ועמודים מימין לשמאל", cells: flag(() => true) },
        { label: "תפריט נגישות למבקרים", hint: "טקסט גדול, ניגודיות, הדגשת קישורים ועצירת אנימציות", cells: flag(() => true) },
        { label: "תמונת שיתוף לוואטסאפ, אינסטגרם ו־X", cells: flag(() => true) },
      ],
    },
    {
      title: "בלוקים",
      rows: [
        { label: "בלוקים בסיסיים", hint: free.join(", "), cells: flag(() => true, () => String(free.length)) },
        { label: "בלוקים לעסקים", hint: plus.join(", "), cells: flag((p) => c[p].businessBlocks, () => String(plus.length)) },
        { label: "טפסי לידים עם תיבת פניות וייצוא CSV", cells: flag((p) => c[p].businessBlocks) },
        { label: "בלוקים מתקדמים", hint: pro.join(", "), cells: flag((p) => c[p].advancedBlocks, () => String(pro.length)) },
        { label: "כפתור וואטסאפ / חיוג צף", cells: flag((p) => c[p].floatingButton) },
        { label: "גלריה כמצגת", cells: flag((p) => c[p].gallerySlideshow) },
      ],
    },
    {
      title: "סטודיו עיצוב",
      rows: [
        { label: "פונטים", cells: counts(countFor(FONTS, (f) => fontCategoryTier(f.category))) },
        { label: "רקעים מוכנים", cells: counts(countFor(BACKGROUNDS, (b) => bgCategoryTier(b.category))) },
        { label: "בונה גרדיאנטים ורקעי תמונה", cells: flag((p) => c[p].customBackgrounds) },
        { label: "התאמה לתמונה (פלטה מהתמונה שלכם)", cells: flag((p) => c[p].customBackgrounds) },
        { label: "רקעים חיים ומונפשים", hint: "ב־Pro גם WebGL בזמן אמת", cells: counts(countFor(realChoices(LIVE_BGS), (x) => x.tier)) },
        { label: "אפקטי שכבה לרקע", cells: counts(countFor(BG_FX.filter((e) => e.id !== "none"), (e) => bgFxCategoryTier(e.category))) },
        { label: "אפקטים לכותרות", cells: counts(countFor(realChoices(TITLE_FX), (x) => x.tier)) },
        { label: "אפקטי מכונת כתיבה", hint: "מהירות, סמן, צבע ולולאה בכל החבילות", cells: counts(countFor(TYPE_FX, (x) => x.tier)) },
        { label: "ערכות עיצוב בלחיצה", cells: counts(countFor(FULL_THEMES, (t) => t.tier)) },
        { label: "סגנונות כפתורים", cells: counts(countFor(CARD_STYLES, (s) => cardCategoryTier(s.category))) },
        { label: "פריסות עמוד", cells: counts(countFor(PAGE_LAYOUTS, (x) => x.tier)) },
        { label: "פריסות כותרת", cells: counts(countFor(HERO_LAYOUTS, (x) => x.tier)) },
        { label: "אנימציות גלילה", cells: counts(countFor(realChoices(REVEALS), (x) => x.tier)) },
        { label: "סגנונות מקטעים", cells: counts(countFor(realChoices(SECTION_STYLES), (x) => x.tier)) },
        { label: "צבעים ואפקטים לכל כפתור", cells: flag((p) => c[p].perElement) },
        { label: "שליטה במהירות האנימציה", cells: flag((p) => c[p].creativeEffects) },
        { label: "סמני עכבר מעוצבים", cells: counts(countFor(realChoices(CURSORS), (x) => x.tier)) },
      ],
    },
    {
      title: "צמיחה ומיתוג",
      rows: [
        { label: "נתונים: צפיות, קליקים ואחוז הקלקה לכל קישור", cells: flag(() => true) },
        { label: "היסטוריית נתונים", cells: flag(() => true, (p) => (c[p].analyticsDays >= 365 ? "שנה" : `${c[p].analyticsDays} יום`)) },
        { label: "מקורות תנועה ומדינות", cells: flag(() => true) },
        { label: "כותרת ותיאור SEO מותאמים", cells: flag((p) => c[p].customSeo) },
        { label: `הסרת התג “${BRAND.name}”`, cells: flag((p) => c[p].removeBadge) },
        { label: "התמונה שלכם כאייקון בלשונית", cells: flag((p) => c[p].customFavicon) },
      ],
    },
  ];
}
