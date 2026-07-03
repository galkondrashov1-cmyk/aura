// Subscription plans. Free for now; prices shown as "soon". Yearly price is the
// headline; monthly billing is +20%. No payment is taken yet — upgrading just
// flips User.plan.

export type Plan = "FREE" | "PLUS" | "PRO";

export const PLAN_RANK: Record<Plan, number> = { FREE: 0, PLUS: 1, PRO: 2 };

export function asPlan(v?: string | null): Plan {
  return v === "PRO" ? "PRO" : v === "PLUS" ? "PLUS" : "FREE";
}

/** What each plan unlocks. Balanced split: generous free base, premium polish paid. */
export type Caps = {
  maxPages: number;
  allBackgrounds: boolean;
  allFonts: boolean;
  premiumThemes: boolean; // one-click full themes
  creativeEffects: boolean; // glitch/rainbow/liquid/neon + creative bg effects
  perElement: boolean; // per-block color + effect overrides
  gallerySlideshow: boolean;
  removeBadge: boolean; // hide "Made with AURA"
  proAssets: boolean; // Pro-exclusive backgrounds/effects/theme packs
  advancedBlocks: boolean; // embed / music / countdown
  customSeo: boolean; // per-page SEO title + description
};

export function caps(plan: Plan): Caps {
  const pro = plan === "PRO";
  const paid = plan !== "FREE";
  return {
    maxPages: pro ? Infinity : paid ? 5 : 1,
    allBackgrounds: paid,
    allFonts: paid,
    premiumThemes: paid,
    creativeEffects: paid,
    perElement: paid,
    gallerySlideshow: paid,
    removeBadge: pro,
    proAssets: pro,
    advancedBlocks: pro,
    customSeo: pro,
  };
}

/** Monthly billing is 20% more than the yearly-billed monthly rate. */
export const MONTHLY_MULTIPLIER = 1.2;

export type PlanInfo = {
  id: Plan;
  name: string;
  tagline: string;
  yearlyPerMonth: number; // headline price (billed yearly)
  accent: string;
  popular?: boolean;
  features: string[];
};

export const PLANS: PlanInfo[] = [
  {
    id: "FREE",
    name: "Free",
    tagline: "Everything you need to launch.",
    yearlyPerMonth: 0,
    accent: "#9aa3af",
    features: [
      "1 page",
      "All core blocks",
      "Essential backgrounds & fonts",
      "Basic hover & idle animations",
      "Built-in analytics",
    ],
  },
  {
    id: "PLUS",
    name: "Plus",
    tagline: "Unlock the full design studio.",
    yearlyPerMonth: 4.99,
    accent: "#00e5a0",
    popular: true,
    features: [
      "Up to 5 pages",
      "All standard backgrounds + 12 one-click themes",
      "Creative effects, special shapes & motion speed",
      "Per-element colors & effects",
      "Gallery slideshow + lightbox",
      "All premium fonts",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "Stand out with exclusive Pro looks.",
    yearlyPerMonth: 7.99,
    accent: "#a855f7",
    features: [
      "Unlimited pages",
      "Everything in Plus",
      "6 Pro themes, special button styles & Pro backgrounds",
      "Advanced blocks: embed, music, countdown",
      "Custom SEO title & description",
      "Remove the AURA badge",
    ],
  },
];

export function monthlyPrice(yearlyPerMonth: number): number {
  return Math.round(yearlyPerMonth * MONTHLY_MULTIPLIER * 100) / 100;
}

/** Headline price label, e.g. "FREE FOR NOW · soon from $4.99/mo". */
export function priceLabel(p: PlanInfo): string {
  if (p.yearlyPerMonth === 0) return "Free forever";
  return `FREE FOR NOW · soon from $${p.yearlyPerMonth.toFixed(2)}/mo`;
}
