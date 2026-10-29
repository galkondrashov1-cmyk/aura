// The full "what does each plan include" table. Every number is computed from
// the real feature lists (fonts, backgrounds, effects, blocks…), so the
// pricing page can never promise something the product doesn't do.
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
  const pages = (p: Plan) => (c[p].maxPages === Infinity ? "Unlimited" : String(c[p].maxPages));
  const free = blockNames("FREE");
  const plus = blockNames("PLUS");
  const pro = blockNames("PRO");

  return [
    {
      title: "Pages",
      rows: [
        { label: "Pages", cells: { FREE: pages("FREE"), PLUS: pages("PLUS"), PRO: pages("PRO") } },
        { label: "Your address", hint: "useaura.me/you, plus useaura.me/you/page for extra pages", cells: flag(() => true) },
        { label: "Starter templates", hint: "Premium touches preview free in the editor", cells: flag(() => true, () => `All ${TEMPLATES.length}`) },
        { label: "Remix — a new look in one tap", cells: flag(() => true) },
        { label: "Hebrew & right-to-left pages", cells: flag(() => true) },
        { label: "Share image for WhatsApp, Instagram & X", cells: flag(() => true) },
      ],
    },
    {
      title: "Blocks",
      rows: [
        { label: "Essential blocks", hint: free.join(", "), cells: flag(() => true, () => String(free.length)) },
        { label: "Business blocks", hint: plus.join(", "), cells: flag((p) => c[p].businessBlocks, () => String(plus.length)) },
        { label: "Lead forms with Inbox & CSV export", cells: flag((p) => c[p].businessBlocks) },
        { label: "Advanced blocks", hint: pro.join(", "), cells: flag((p) => c[p].advancedBlocks, () => String(pro.length)) },
        { label: "Floating WhatsApp / call button", cells: flag((p) => c[p].floatingButton) },
        { label: "Gallery slideshow", cells: flag((p) => c[p].gallerySlideshow) },
      ],
    },
    {
      title: "Design studio",
      rows: [
        { label: "Fonts", cells: counts(countFor(FONTS, (f) => fontCategoryTier(f.category))) },
        { label: "Preset backgrounds", cells: counts(countFor(BACKGROUNDS, (b) => bgCategoryTier(b.category))) },
        { label: "Gradient builder & photo backgrounds", cells: flag((p) => c[p].customBackgrounds) },
        { label: "Match my photo (palette from your picture)", cells: flag((p) => c[p].customBackgrounds) },
        { label: "Live animated backgrounds", hint: "Pro adds real-time WebGL", cells: counts(countFor(realChoices(LIVE_BGS), (x) => x.tier)) },
        { label: "Background overlay effects", cells: counts(countFor(BG_FX.filter((e) => e.id !== "none"), (e) => bgFxCategoryTier(e.category))) },
        { label: "Title effects", cells: counts(countFor(realChoices(TITLE_FX), (x) => x.tier)) },
        { label: "One-click themes", cells: counts(countFor(FULL_THEMES, (t) => t.tier)) },
        { label: "Button styles", cells: counts(countFor(CARD_STYLES, (s) => cardCategoryTier(s.category))) },
        { label: "Page layouts", cells: counts(countFor(PAGE_LAYOUTS, (x) => x.tier)) },
        { label: "Header layouts", cells: counts(countFor(HERO_LAYOUTS, (x) => x.tier)) },
        { label: "Scroll animations", cells: counts(countFor(realChoices(REVEALS), (x) => x.tier)) },
        { label: "Section styles", cells: counts(countFor(realChoices(SECTION_STYLES), (x) => x.tier)) },
        { label: "Per-button colors & effects", cells: flag((p) => c[p].perElement) },
        { label: "Animation speed control", cells: flag((p) => c[p].creativeEffects) },
        { label: "Custom cursors", cells: counts(countFor(realChoices(CURSORS), (x) => x.tier)) },
      ],
    },
    {
      title: "Growth & brand",
      rows: [
        { label: "Analytics: views, clicks, click rate per link", cells: flag(() => true) },
        { label: "Analytics history", cells: flag(() => true, (p) => (c[p].analyticsDays >= 365 ? "1 year" : `${c[p].analyticsDays} days`)) },
        { label: "Referrers & countries", cells: flag(() => true) },
        { label: "Custom SEO title & description", cells: flag((p) => c[p].customSeo) },
        { label: "Remove “Made with AURA”", cells: flag((p) => c[p].removeBadge) },
        { label: "Your photo as the browser-tab icon", cells: flag((p) => c[p].customFavicon) },
      ],
    },
  ];
}
