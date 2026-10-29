// Design studio 2.0 — the dimensions on top of the classic presets in
// design.ts: page & hero layouts, title effects, typography controls, custom
// gradient / photo backgrounds, live (canvas) backgrounds, scroll reveals,
// section containers, cursors — plus the Remix generator and palette tools.
import type { Block, BlockType, CustomBackground, PageContent, PageDesign } from "@/lib/blocks";
import {
  BACKGROUNDS,
  CARD_STYLES,
  BUTTON_FX,
  BG_FX,
  LIGHT_VARS,
  bgCategoryTier,
  fontCategoryTier,
  shapeTier,
  cardCategoryTier,
  bgFxCategoryTier,
  catLabel,
} from "@/lib/design";
import { FONTS } from "@/lib/fonts";
import { caps, PLAN_RANK, type Plan } from "@/lib/plans";

export type Choice = { id: string; name: string; tier: Plan; hint?: string };

export const allowed = (tier: Plan, plan: Plan) => PLAN_RANK[tier] <= PLAN_RANK[plan];

// ---------- Structure ----------
export const PAGE_LAYOUTS: Choice[] = [
  { id: "stack", name: "קלאסי", tier: "FREE", hint: "עמודה אחת ממורכזת" },
  { id: "card", name: "כרטיס צף", tier: "FREE", hint: "התוכן על כרטיס מעל הרקע" },
  { id: "split", name: "מסך מפוצל", tier: "PLUS", hint: "פרופיל קבוע בצד, התוכן לידו (מסכים רחבים)" },
];

export const HERO_LAYOUTS: Choice[] = [
  { id: "center", name: "ממורכז", tier: "FREE" },
  { id: "left", name: "מיושר", tier: "FREE" },
  { id: "split", name: "זה לצד זה", tier: "PLUS" },
  { id: "cover", name: "שער", tier: "PLUS", hint: "באנר ברוחב מלא עם השם שלכם עליו" },
  { id: "big", name: "פוסטר", tier: "PLUS", hint: "טיפוגרפיה ענקית ומצהירה" },
];

// ---------- Typography ----------
export const TITLE_FX: Choice[] = [
  { id: "none", name: "ללא", tier: "FREE" },
  { id: "gradient", name: "גרדיאנט", tier: "FREE" },
  { id: "glow", name: "זוהר", tier: "FREE" },
  { id: "outline", name: "קו מתאר", tier: "FREE" },
  { id: "highlight", name: "מרקר", tier: "FREE" },
  { id: "retro", name: "צל רטרו", tier: "FREE" },
  { id: "chrome", name: "כרום", tier: "PLUS" },
  { id: "neon", name: "ניאון", tier: "PLUS" },
  { id: "shimmer", name: "נצנוץ", tier: "PLUS" },
  { id: "aurora", name: "זוהר צפוני", tier: "PLUS" },
  { id: "fire", name: "מותך", tier: "PLUS" },
  { id: "extrude", name: "תלת־ממד", tier: "PLUS" },
  { id: "glitch", name: "גליץ׳", tier: "PRO" },
  { id: "holo", name: "הולוגרפי", tier: "PRO" },
];

export const HEADING_WEIGHTS = [
  { id: "normal", name: "רגיל", value: "500" },
  { id: "semibold", name: "חצי מודגש", value: "600" },
  { id: "bold", name: "מודגש", value: "700" },
  { id: "black", name: "שחור", value: "800" },
];
export const HEADING_CASES = [
  { id: "none", name: "Aa", value: "none" },
  { id: "upper", name: "AA", value: "uppercase" },
];
export const HEADING_TRACKING = [
  { id: "tight", name: "צפוף", value: "-0.035em" },
  { id: "normal", name: "רגיל", value: "-0.01em" },
  { id: "wide", name: "רחב", value: "0.08em" },
];

/** Curated heading/body pairings shown as one-tap chips. */
export const FONT_PAIRS: { id: string; name: string; head: string; body: string }[] = [
  { id: "editorial", name: "מגזיני", head: "instrument", body: "inter" },
  { id: "luxe", name: "יוקרתי", head: "playfair", body: "dmsans" },
  { id: "statement", name: "הצהרה", head: "unbounded", body: "manrope" },
  { id: "studio", name: "סטודיו", head: "syne", body: "inter" },
  { id: "warm", name: "חמים", head: "fraunces", body: "outfit" },
  { id: "poster", name: "פוסטר", head: "bebas", body: "dmsans" },
  { id: "fashion", name: "אופנה", head: "abril", body: "poppins" },
  { id: "tech", name: "טכנולוגי", head: "grotesk", body: "spacemono" },
  { id: "playful", name: "שובב", head: "righteous", body: "nunito" },
  { id: "hebrew-modern", name: "עברית מודרני", head: "secular", body: "heebo" },
  { id: "hebrew-classic", name: "עברית קלאסי", head: "frankruhl", body: "assistant" },
  { id: "hebrew-soft", name: "עברית רך", head: "fredoka", body: "rubik" },
];

// ---------- Containers & motion ----------
export const SECTION_STYLES: Choice[] = [
  { id: "none", name: "ללא", tier: "FREE" },
  { id: "glass", name: "זכוכית", tier: "FREE" },
  { id: "solid", name: "מלא", tier: "FREE" },
  { id: "outline", name: "קו מתאר", tier: "FREE" },
  { id: "soft", name: "צל רך", tier: "FREE" },
  { id: "paper", name: "נייר", tier: "PLUS" },
  { id: "gradient", name: "קצה גרדיאנט", tier: "PLUS" },
  { id: "neon", name: "ניאון", tier: "PLUS" },
  { id: "brutal", name: "ברוטלי", tier: "PLUS" },
];

export const REVEALS: Choice[] = [
  { id: "none", name: "ללא", tier: "FREE" },
  { id: "rise", name: "עלייה", tier: "FREE" },
  { id: "fade", name: "דהייה", tier: "FREE" },
  { id: "zoom", name: "זום", tier: "PLUS" },
  { id: "blur", name: "מטושטש פנימה", tier: "PLUS" },
  { id: "slide", name: "החלקה", tier: "PLUS" },
  { id: "flip", name: "היפוך", tier: "PLUS" },
  { id: "tilt", name: "הטיה", tier: "PLUS" },
];

export const LIVE_BGS: Choice[] = [
  { id: "none", name: "ללא", tier: "FREE" },
  { id: "particles", name: "קונסטלציה", tier: "PLUS", hint: "חלקיקים מחוברים שמגיבים לעכבר" },
  { id: "fireflies", name: "גחליליות", tier: "PLUS" },
  { id: "snow", name: "שלג", tier: "PLUS" },
  { id: "bubbles", name: "בועות", tier: "PLUS" },
  { id: "waves", name: "גלים", tier: "PLUS" },
  { id: "confetti", name: "קונפטי", tier: "PLUS" },
  { id: "warp", name: "חלל־על", tier: "PRO" },
  { id: "liquid", name: "רשת נוזלית", tier: "PRO", hint: "גרדיאנט זורם בזמן אמת (WebGL)" },
  { id: "silk", name: "משי", tier: "PRO", hint: "משי אור גלי (WebGL)" },
];

export const CURSORS: Choice[] = [
  { id: "none", name: "מערכת", tier: "FREE" },
  { id: "ring", name: "טבעת", tier: "PRO" },
  { id: "glow", name: "כדור זוהר", tier: "PRO" },
  { id: "trail", name: "שובל ניצוצות", tier: "PRO" },
  { id: "blend", name: "היפוך צבעים", tier: "PRO" },
];

export const INTROS = [
  { id: "aura", name: "פתיח לוגו" },
  { id: "fade", name: "דהייה מהירה" },
  { id: "none", name: "מיידי" },
];

export const GRADIENT_TYPES: { id: CustomBackground["type"]; name: string }[] = [
  { id: "mesh", name: "רשת צבעים" },
  { id: "linear", name: "ליניארי" },
  { id: "radial", name: "רדיאלי" },
  { id: "conic", name: "קוני" },
];

// ---------- Color helpers ----------
export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (x: number) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function hslHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(255 * f(0), 255 * f(8), 255 * f(4));
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60;
  return [h, s * 100, l * 100];
}

/** Relative luminance (0 = black, 1 = white). */
export function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Readable text color on top of `accent`: near-black or white, whichever contrasts more. */
export function inkFor(accent: string): string | undefined {
  if (!hexToRgb(accent)) return undefined;
  const l = luminance(accent);
  return (l + 0.05) / 0.054 >= 1.05 / (l + 0.05) ? "#0b0c10" : "#ffffff";
}

// ---------- Backgrounds ----------
export function customBgCss(c: CustomBackground): string {
  const [a, b, x = c.colors[0], y] = c.colors;
  const angle = c.angle ?? 150;
  switch (c.type) {
    case "linear":
      return `linear-gradient(${angle}deg, ${c.colors.join(", ")})`;
    case "radial":
      return `radial-gradient(130% 100% at 50% 0%, ${c.colors.join(", ")})`;
    case "conic":
      return `conic-gradient(from ${angle}deg at 50% 38%, ${[...c.colors, c.colors[0]].join(", ")})`;
    case "mesh":
    default:
      return [
        `radial-gradient(at 12% 8%, ${a} 0px, transparent 55%)`,
        `radial-gradient(at 88% 14%, ${b} 0px, transparent 50%)`,
        `radial-gradient(at 70% 92%, ${x} 0px, transparent 55%)`,
        y ? `radial-gradient(at 8% 85%, ${y} 0px, transparent 50%)` : "",
        `color-mix(in oklab, ${a} 18%, #05060a)`,
      ]
        .filter(Boolean)
        .join(", ");
  }
}

export function customBgIsLight(c: CustomBackground): boolean {
  const avg = c.colors.reduce((s, col) => s + luminance(col), 0) / c.colors.length;
  return c.type === "mesh" ? false : avg > 0.45;
}

export type ResolvedBackground = {
  css?: string;
  light: boolean;
  image?: { url: string; dim: number; blur: number };
};

/** Photo beats custom gradient beats preset. */
export function resolveBackground(d?: PageDesign): ResolvedBackground {
  if (d?.bgImage) {
    return {
      css: "#07080b",
      light: false,
      image: { url: d.bgImage, dim: d.bgImageDim ?? 45, blur: d.bgImageBlur ?? 0 },
    };
  }
  if (d?.bgCustom && d.bgCustom.colors.length >= 2) {
    return { css: customBgCss(d.bgCustom), light: customBgIsLight(d.bgCustom) };
  }
  const bg = d?.background ? BACKGROUNDS.find((b) => b.id === d.background) : undefined;
  return { css: bg?.css, light: !!bg?.light };
}

export { LIGHT_VARS };

// ---------- RTL ----------
const RTL_CHARS = /[֐-׿؀-ۿ]/;
export function looksRtl(text: string): boolean {
  return RTL_CHARS.test(text);
}

// ---------- Remix: a fresh, coherent design every tap ----------
const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickAllowed = (list: Choice[], plan: Plan, skip: string[] = []) =>
  rand(list.filter((c) => allowed(c.tier, plan) && !skip.includes(c.id)));

const SERIF_OR_DISPLAY = new Set(["Serif", "Display", "Handwriting"]);

/**
 * Generate a complete, harmonious look: a color harmony around a random hue,
 * a background built from it, a font pairing, button language, title effect,
 * motion and containers — only from what the plan unlocks. Content, SEO,
 * photo backgrounds and the floating button are never touched.
 */
export function remixDesign(plan: Plan, keepRtl = false): Partial<PageDesign> {
  const paid = plan !== "FREE";
  const h = Math.floor(Math.random() * 360);
  const harmony = rand([30, 40, 150, 180, 210, 120]);
  const h2 = (h + harmony) % 360;
  const h3 = (h + 300) % 360;
  const light = Math.random() < 0.18;

  const accent = light ? hslHex(h, 78, 44) : hslHex(h, 88, 64);

  const patch: Partial<PageDesign> = {
    accent,
    bgImage: undefined,
    textColor: undefined,
  };

  if (paid) {
    const type = rand<CustomBackground["type"]>(["mesh", "mesh", "linear", "radial"]);
    patch.bgCustom = light
      ? { type: type === "mesh" ? "linear" : type, colors: [hslHex(h, 70, 93), hslHex(h2, 70, 86)], angle: rand([135, 160, 200]) }
      : {
          type,
          colors:
            type === "mesh"
              ? [hslHex(h, 75, 26), hslHex(h2, 70, 22), hslHex(h3, 70, 18)]
              : [hslHex(h, 55, 9), hslHex(h2, 60, 17)],
          angle: rand([135, 150, 165, 200]),
        };
    patch.background = undefined;
    patch.bgAnimate = Math.random() < 0.3;
  } else {
    const pool = BACKGROUNDS.filter((b) =>
      ["Gradient", "Mesh", "Aurora", "Sunset", "Ocean", "Neon"].includes(b.category),
    );
    patch.background = rand(pool).id;
    patch.bgCustom = undefined;
  }

  // Fonts: free plans stay within Sans (+ Hebrew when the page is RTL).
  const fontPool = FONTS.filter((f) =>
    paid ? true : f.category === "Sans" || (keepRtl && f.category === "Hebrew"),
  ).filter((f) => (keepRtl ? f.category === "Hebrew" : f.category !== "Hebrew"));
  const pair = paid && !keepRtl && Math.random() < 0.7 ? rand(FONT_PAIRS.filter((p) => !p.id.startsWith("hebrew"))) : null;
  if (pair) {
    patch.headingFont = pair.head;
    patch.font = pair.body;
  } else {
    const body = rand(fontPool.filter((f) => !SERIF_OR_DISPLAY.has(f.category) || keepRtl));
    patch.font = body?.id;
    patch.headingFont = keepRtl ? rand(fontPool)?.id : undefined;
  }
  patch.headingWeight = rand(["normal", "semibold", "bold", "black"]);
  patch.headingCase = Math.random() < 0.2 ? "upper" : "none";
  patch.headingTracking = patch.headingCase === "upper" ? "wide" : rand(["tight", "normal"]);

  const cards = CARD_STYLES.filter((c) => (plan === "PRO" ? true : c.category !== "Special"));
  patch.card = rand(cards).id;
  patch.buttonShape = rand(paid ? ["pill", "rounded", "soft", "sharp", "leaf", "slant"] : ["pill", "rounded", "soft", "sharp"]);
  patch.buttonSize = rand(["sm", "md", "md", "lg"]);
  const fx = BUTTON_FX.filter((e) => paid || e.category !== "Creative");
  patch.buttonFx = rand(fx).id;
  patch.titleFx = pickAllowed(TITLE_FX, plan).id;
  patch.reveal = pickAllowed(REVEALS, plan, ["none"]).id;
  patch.section = pickAllowed(SECTION_STYLES, plan).id;
  patch.layout = pickAllowed(PAGE_LAYOUTS, plan).id;
  patch.spacing = rand(["compact", "cozy", "cozy", "roomy"]);
  const bgfx = BG_FX.filter(
    (e) => e.category !== "Interactive" && (paid || e.category !== "Creative"),
  );
  patch.bgFx = Math.random() < 0.6 ? rand(bgfx).id : "none";
  patch.liveBg = paid && Math.random() < 0.35 ? pickAllowed(LIVE_BGS, plan, ["none"]).id : "none";
  return patch;
}

// ---------- Palette from a photo ----------
/**
 * Given colors sampled from an image (most common first), build a matching
 * look: the most vivid color becomes the accent, the rest become a deep mesh.
 */
export function paletteDesign(colors: string[]): Partial<PageDesign> | null {
  const hsl = colors
    .map((c) => {
      const rgb = hexToRgb(c);
      return rgb ? { hex: c, hsl: rgbToHsl(...rgb) } : null;
    })
    .filter((x): x is { hex: string; hsl: [number, number, number] } => !!x);
  if (hsl.length === 0) return null;
  const vivid = [...hsl].sort((a, b) => b.hsl[1] * (1 - Math.abs(b.hsl[2] - 55) / 55) - a.hsl[1] * (1 - Math.abs(a.hsl[2] - 55) / 55))[0];
  const [ah, as] = vivid.hsl;
  const accent = hslHex(ah, Math.max(as, 65), 62);
  const deep = hsl.slice(0, 3).map(({ hsl: [hh, ss] }) => hslHex(hh, Math.min(80, Math.max(ss, 35)), 22));
  while (deep.length < 3) deep.push(hslHex((ah + 40 * deep.length) % 360, 60, 18));
  return {
    accent,
    bgCustom: { type: "mesh", colors: deep, angle: 150 },
    background: undefined,
    bgImage: undefined,
  };
}

// ---------- Plan fitting ----------

/** Which plan each block type needs. */
export const BLOCK_TIER: Record<BlockType, Plan> = {
  hero: "FREE",
  links: "FREE",
  text: "FREE",
  socials: "FREE",
  image: "FREE",
  gallery: "FREE",
  video: "FREE",
  divider: "FREE",
  faq: "FREE",
  features: "FREE",
  testimonials: "FREE",
  map: "FREE",
  spacer: "FREE",
  marquee: "PLUS",
  stats: "PLUS",
  pricing: "PLUS",
  form: "PLUS",
  embed: "PRO",
  music: "PRO",
  countdown: "PRO",
};

const tierOf = (list: Choice[], id?: string) => list.find((c) => c.id === id)?.tier ?? "FREE";
const nameOf = (list: Choice[], id?: string) => list.find((c) => c.id === id)?.name ?? id ?? "";

export type LockedFeature = { label: string; tier: Plan };

/** Hebrew block names for the "what your live page skips" list. */
const BLOCK_LABEL: Partial<Record<BlockType, string>> = {
  features: "שירותים", testimonials: "המלצות", stats: "מספרים", pricing: "מחירון", form: "טופס",
  map: "מפה", marquee: "טקסט רץ", embed: "הטמעה", music: "מוזיקה", countdown: "ספירה לאחור",
};

const PREMIUM_DIVIDERS = new Set(["shimmer", "march", "pulse"]);

/**
 * Downgrade everything the plan doesn't include to its closest free cousin,
 * and report what changed. Used on the server for every public render (so
 * paid features can't be unlocked by editing a request, and lapse cleanly on
 * downgrade), when creating pages from templates, and by the editor to tell
 * the creator exactly what their live page won't show. Content is never lost —
 * the stored page keeps everything; only the rendered result is fitted.
 */
export function fitToPlanReport(content: PageContent, plan: Plan): { content: PageContent; locked: LockedFeature[] } {
  if (plan === "PRO") return { content, locked: [] };
  const c = caps(plan);
  const ok = (t: Plan) => allowed(t, plan);
  const locked = new Map<string, Plan>();
  const lock = (label: string, tier: Plan) => locked.set(label, tier);
  const d = { ...(content.design ?? {}) };
  const font = (id?: string) => FONTS.find((f) => f.id === id);
  const rtl = d.dir === "rtl";

  for (const key of ["font", "headingFont"] as const) {
    const f = font(d[key]);
    if (f && !ok(fontCategoryTier(f.category))) {
      lock(`פונט: ${f.name}`, fontCategoryTier(f.category));
      d[key] = key === "font" ? (rtl ? "heebo" : "inter") : rtl ? "secular" : undefined;
    }
  }
  const choice = (key: "titleFx" | "layout" | "reveal" | "section" | "liveBg" | "cursor", list: Choice[], fallback: string | undefined, what: string) => {
    const t = tierOf(list, d[key]);
    if (!ok(t)) {
      lock(`${what}: ${nameOf(list, d[key])}`, t);
      d[key] = fallback;
    }
  };
  choice("titleFx", TITLE_FX, "gradient", "אפקט כותרת");
  choice("layout", PAGE_LAYOUTS, "card", "פריסה");
  choice("reveal", REVEALS, "rise", "אנימציית גלילה");
  choice("section", SECTION_STYLES, "glass", "סגנון מקטעים");
  choice("liveBg", LIVE_BGS, "none", "רקע חי");
  choice("cursor", CURSORS, "none", "סמן עכבר");

  if (!c.customBackgrounds && (d.bgCustom || d.bgImage)) {
    lock(d.bgImage ? "רקע תמונה" : "גרדיאנט מותאם", "PLUS");
    d.background = d.bgCustom && customBgIsLight(d.bgCustom) ? undefined : "mesh-5";
    d.bgCustom = undefined;
    d.bgImage = undefined;
  }
  if (!c.customBackgrounds && d.bgAnimate) {
    lock("גרדיאנט זורם", "PLUS");
    d.bgAnimate = undefined;
  }
  if (d.background) {
    const bg = BACKGROUNDS.find((b) => b.id === d.background);
    if (bg && !ok(bgCategoryTier(bg.category))) {
      lock(`רקע: ${catLabel(bg.category)}`, bgCategoryTier(bg.category));
      d.background = "mesh-5";
    }
  }
  if (!c.floatingButton && d.fab) {
    lock("כפתור צף", "PLUS");
    d.fab = undefined;
  }
  if (!c.creativeEffects && d.motionSpeed && d.motionSpeed !== "normal") {
    lock("מהירות אנימציה", "PLUS");
    d.motionSpeed = undefined;
  }
  if (!c.customSeo && (d.seoTitle || d.seoDescription)) {
    lock("SEO מותאם", "PLUS");
    d.seoTitle = undefined;
    d.seoDescription = undefined;
  }
  if (d.buttonShape && !ok(shapeTier(d.buttonShape))) {
    lock(`צורת כפתור: ${d.buttonShape}`, shapeTier(d.buttonShape));
    d.buttonShape = "rounded";
  }
  const card = CARD_STYLES.find((x) => x.id === d.card);
  if (card && !ok(cardCategoryTier(card.category))) {
    lock(`סגנון כפתור: ${card.name}`, cardCategoryTier(card.category));
    d.card = "glass-frost";
  }
  const fx = BG_FX.find((e) => e.id === d.bgFx);
  if (fx && !ok(bgFxCategoryTier(fx.category))) {
    lock(`אפקט רקע: ${fx.name}`, bgFxCategoryTier(fx.category));
    d.bgFx = "topglow";
  }
  const creative = (id?: string) => BUTTON_FX.find((e) => e.id === id)?.category === "Creative";
  if (!c.creativeEffects && creative(d.buttonFx)) {
    lock("אפקטי מעבר יצירתיים", "PLUS");
    d.buttonFx = "growglow";
  }

  const blocks: Block[] = [];
  for (const b0 of content.blocks) {
    const tier = BLOCK_TIER[b0.type];
    if (!ok(tier)) {
      lock(`בלוק ${BLOCK_LABEL[b0.type] ?? b0.type}`, tier);
      continue;
    }
    let b: Block = b0;
    const set = (patch: Record<string, unknown>) => (b = { ...b, ...patch } as Block);
    if (b.box && b.box !== "inherit" && !ok(tierOf(SECTION_STYLES, b.box))) {
      lock(`סגנון מקטע: ${nameOf(SECTION_STYLES, b.box)}`, tierOf(SECTION_STYLES, b.box));
      set({ box: undefined });
    }
    if (b.anim && !ok(tierOf(REVEALS, b.anim))) {
      lock(`אנימציית גלילה: ${nameOf(REVEALS, b.anim)}`, tierOf(REVEALS, b.anim));
      set({ anim: undefined });
    }
    if (b.type === "hero" && b.layout && !ok(tierOf(HERO_LAYOUTS, b.layout))) {
      lock(`פריסת כותרת: ${nameOf(HERO_LAYOUTS, b.layout)}`, tierOf(HERO_LAYOUTS, b.layout));
      set({ layout: "center" });
    }
    if (!c.perElement) {
      if (b.type === "links" && b.items.some((l) => l.color || l.fx)) {
        lock("צבעים ואפקטים לכל כפתור", "PLUS");
        set({ items: b.items.map((l) => ({ ...l, color: undefined, fx: undefined })) });
      }
      if ((b.type === "text" || b.type === "divider") && b.color) {
        lock("צבעי בלוקים", "PLUS");
        set({ color: undefined });
      }
      if (b.type === "socials" && b.iconColor) {
        lock("צבעי בלוקים", "PLUS");
        set({ iconColor: undefined });
      }
      if (b.type === "divider" && b.style && PREMIUM_DIVIDERS.has(b.style)) {
        lock("מפרידים מונפשים", "PLUS");
        set({ style: "line" });
      }
    }
    if (!c.creativeEffects && b.type === "links" && creative(b.buttonFx)) {
      lock("אפקטי מעבר יצירתיים", "PLUS");
      set({ buttonFx: undefined });
    }
    if (!c.gallerySlideshow && b.type === "gallery" && b.layout === "carousel") {
      lock("גלריה כמצגת", "PLUS");
      set({ layout: "grid" });
    }
    blocks.push(b);
  }

  return {
    content: { blocks, design: d },
    locked: [...locked].map(([label, tier]) => ({ label, tier })),
  };
}

export function fitToPlan(content: PageContent, plan: Plan): PageContent {
  return fitToPlanReport(content, plan).content;
}
