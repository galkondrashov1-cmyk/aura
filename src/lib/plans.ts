// Subscription plans — the single source of truth for what each plan costs
// and unlocks. Prices live in pricing.json (shared with the PayPal setup
// script). During early access every plan is free; paid tiers can only be
// bought once PayPal is configured.
import { BRAND } from "@/lib/brand";
import pricing from "./pricing.json";

export type Plan = "FREE" | "PLUS" | "PRO";

export const PLAN_RANK: Record<Plan, number> = { FREE: 0, PLUS: 1, PRO: 2 };

export function asPlan(v?: string | null): Plan {
  return v === "PRO" ? "PRO" : v === "PLUS" ? "PLUS" : "FREE";
}

/** What each plan unlocks. The editor gates on these AND the server enforces them (fitToPlan). */
export type Caps = {
  maxPages: number;
  /** How far back analytics go. */
  analyticsDays: number;
  allBackgrounds: boolean;
  allFonts: boolean;
  premiumThemes: boolean; // one-click full themes
  creativeEffects: boolean; // glitch/rainbow/liquid/neon hover + creative bg effects + motion speed
  perElement: boolean; // per-block / per-button colors & effects
  gallerySlideshow: boolean;
  removeBadge: boolean; // hide the brand badge
  proAssets: boolean; // Pro-exclusive backgrounds, themes, button styles, cursors, WebGL
  advancedBlocks: boolean; // embed / music / countdown
  businessBlocks: boolean; // marquee / stats / pricing / forms
  customSeo: boolean; // per-page SEO title + description
  customBackgrounds: boolean; // gradient builder, photo backgrounds, palette-from-photo
  floatingButton: boolean; // sticky WhatsApp / call / link button
  customFavicon: boolean; // browser-tab icon from your profile photo
};

export function caps(plan: Plan): Caps {
  const pro = plan === "PRO";
  const paid = plan !== "FREE";
  return {
    maxPages: pro ? Infinity : paid ? 5 : 1,
    analyticsDays: paid ? 365 : 30,
    allBackgrounds: paid,
    allFonts: paid,
    premiumThemes: paid,
    creativeEffects: paid,
    perElement: paid,
    gallerySlideshow: paid,
    removeBadge: pro,
    proAssets: pro,
    advancedBlocks: pro,
    businessBlocks: paid,
    customSeo: paid,
    customBackgrounds: paid,
    floatingButton: paid,
    customFavicon: pro,
  };
}

export const CURRENCY = { code: pricing.currency, symbol: pricing.symbol };

export type PlanInfo = {
  id: Plan;
  name: string;
  tagline: string;
  /** Who it's for, in one line. */
  forWho: string;
  /** Price per month when billed yearly (headline). */
  yearlyPerMonth: number;
  /** Price when billed monthly. */
  monthly: number;
  accent: string;
  popular?: boolean;
  /** The 4–6 reasons to pick this plan (cards); the full matrix is PLAN_MATRIX. */
  highlights: string[];
};

export const PLANS: PlanInfo[] = [
  {
    id: "FREE",
    name: "חינם",
    tagline: "עמוד יפהפה, בחינם לתמיד.",
    forWho: "הלינק־בביו הראשון שלכם",
    yearlyPerMonth: 0,
    monthly: 0,
    accent: "#8a8378",
    highlights: [
      `עמוד אחד בכתובת ${BRAND.domain}/noa`,
      "כל התבניות, Remix ובלוקים בסיסיים",
      "פונטים בעברית ועמודים מימין לשמאל",
      "נתונים של 30 יום",
    ],
  },
  {
    id: "PLUS",
    name: "Plus",
    tagline: "כל מה שעסק קטן צריך.",
    forWho: "יוצרים, פרילנסרים ועסקים מקומיים",
    yearlyPerMonth: pricing.plans.PLUS.yearlyPerMonth,
    monthly: pricing.plans.PLUS.monthly,
    accent: "#ff5a1f",
    popular: true,
    highlights: [
      "5 עמודים",
      "טפסי לידים עם תיבת פניות ו־CSV, מחירון, מספרים",
      "כפתור וואטסאפ / חיוג צף",
      "רקעי גרדיאנט ותמונה, רקעים חיים",
      "כל הפונטים, הערכות, הפריסות והאנימציות",
      "SEO מותאם ונתונים של שנה שלמה",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "המותג שלכם, של אף אחד אחר.",
    forWho: "מותגים, סטודיואים ומשתמשים מתקדמים",
    yearlyPerMonth: pricing.plans.PRO.yearlyPerMonth,
    monthly: pricing.plans.PRO.monthly,
    accent: "#141210",
    highlights: [
      "כל מה שיש ב־Plus",
      "עמודים ללא הגבלה",
      `בלי התג “${BRAND.name}”`,
      "התמונה שלכם כאייקון בלשונית",
      "רקעי WebGL, סמני עכבר וערכות Pro",
      "הטמעות, נגני מוזיקה וספירה לאחור",
    ],
  },
];

export function planInfo(id: Plan): PlanInfo {
  return PLANS.find((p) => p.id === id)!;
}

/** "₪14.90" */
export function formatPrice(n: number): string {
  return `${CURRENCY.symbol}${n.toFixed(2)}`;
}
