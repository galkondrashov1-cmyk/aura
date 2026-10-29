// Subscription plans — the single source of truth for what each plan costs
// and unlocks. Prices live in pricing.json (shared with the PayPal setup
// script). During early access every plan is free; paid tiers can only be
// bought once PayPal is configured.
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
  removeBadge: boolean; // hide "Made with AURA"
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
    name: "Free",
    tagline: "A beautiful page, free forever.",
    forWho: "Your first link-in-bio",
    yearlyPerMonth: 0,
    monthly: 0,
    accent: "#9aa3af",
    highlights: [
      "1 page at useaura.me/you",
      "Every template, Remix & essential blocks",
      "Hebrew fonts & right-to-left pages",
      "30 days of analytics",
    ],
  },
  {
    id: "PLUS",
    name: "Plus",
    tagline: "Everything a small business needs.",
    forWho: "Creators, freelancers & local businesses",
    yearlyPerMonth: pricing.plans.PLUS.yearlyPerMonth,
    monthly: pricing.plans.PLUS.monthly,
    accent: "#00e5a0",
    popular: true,
    highlights: [
      "5 pages",
      "Lead forms with Inbox & CSV, pricing, stats",
      "Floating WhatsApp / call button",
      "Gradient & photo backgrounds, live backgrounds",
      "All fonts, themes, layouts & animations",
      "Custom SEO & a full year of analytics",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "Your brand, nobody else's.",
    forWho: "Brands, studios & power users",
    yearlyPerMonth: pricing.plans.PRO.yearlyPerMonth,
    monthly: pricing.plans.PRO.monthly,
    accent: "#a855f7",
    highlights: [
      "Everything in Plus",
      "Unlimited pages",
      "No “Made with AURA” badge",
      "Your photo as the browser-tab icon",
      "WebGL backgrounds, custom cursors, Pro themes",
      "Embeds, music players & countdowns",
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
