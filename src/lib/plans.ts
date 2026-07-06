// הילה — subscription plans.
// FREE      — עמוד נחיתה עם עיצוב בסיסי.
// DESIGN    — ₪9.90/חודש: כל אפשרויות העיצוב.
// BUSINESS  — ₪49.99/חודש: הכל + עמוד זימון תורים ופגישות.
// Payments are demo for now — "upgrading" flips Business.plan.

export type Plan = "FREE" | "DESIGN" | "BUSINESS";

export const PLAN_RANK: Record<Plan, number> = { FREE: 0, DESIGN: 1, BUSINESS: 2 };

export function asPlan(v?: string | null): Plan {
  return v === "BUSINESS" ? "BUSINESS" : v === "DESIGN" ? "DESIGN" : "FREE";
}

export type Caps = {
  allThemes: boolean; // all theme presets (free: first 3)
  allBackgrounds: boolean; // gradients, patterns, animated (free: basics)
  allFonts: boolean; // full Hebrew font library (free: 2)
  allButtons: boolean; // all button shapes + fills
  effects: boolean; // entrance animations, halo glow effects
  booking: boolean; // public booking page + appointment management
};

export function caps(plan: Plan): Caps {
  const paid = plan !== "FREE";
  return {
    allThemes: paid,
    allBackgrounds: paid,
    allFonts: paid,
    allButtons: paid,
    effects: paid,
    booking: plan === "BUSINESS",
  };
}

export type PlanInfo = {
  id: Plan;
  name: string;
  tagline: string;
  monthly: number; // ₪ per month
  accent: string;
  popular?: boolean;
  features: string[];
};

export const PLANS: PlanInfo[] = [
  {
    id: "FREE",
    name: "חינם",
    tagline: "עמוד נחיתה מעוצב לעסק — בחינם, לתמיד.",
    monthly: 0,
    accent: "#9aa3af",
    features: [
      "עמוד נחיתה אחד",
      "כתובת אישית לעסק",
      "3 ערכות עיצוב",
      "רקעים ופונטים בסיסיים",
      "פרטי קשר, וואטסאפ ושעות פעילות",
      "סטטיסטיקת צפיות",
    ],
  },
  {
    id: "DESIGN",
    name: "עיצוב",
    tagline: "כל סטודיו העיצוב פתוח.",
    monthly: 9.9,
    accent: "#f0b429",
    popular: true,
    features: [
      "כל מה שבחינם",
      "כל ערכות העיצוב",
      "רקעים חיים: גרדיאנטים, תבניות והילות",
      "כל ספריית הפונטים העבריים",
      "כל סגנונות הכפתורים",
      "אנימציות ואפקטים",
    ],
  },
  {
    id: "BUSINESS",
    name: "עסקים",
    tagline: "האתר עובד בשבילך — תורים ופגישות 24/7.",
    monthly: 49.99,
    accent: "#8b7cf6",
    features: [
      "כל מה שבעיצוב",
      "עמוד זימון תורים ופגישות",
      "אימות לקוח ב־SMS (דמו)",
      "ניהול שירותים, מחירים ושעות פעילות",
      "יומן תורים עם אישור אוטומטי או ידני",
      "ביטול תור בקליק ללקוח",
    ],
  },
];

export function planInfo(plan: Plan): PlanInfo {
  return PLANS.find((p) => p.id === plan) ?? PLANS[0];
}

export function priceLabel(p: PlanInfo): string {
  if (p.monthly === 0) return "חינם לתמיד";
  return `₪${p.monthly.toFixed(2)} / חודש`;
}
