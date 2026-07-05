import type { PageDesign } from "@/lib/blocks";
import type { Plan } from "@/lib/plans";

// Category → required plan tier. Free gets a generous base; the rest is paid.
const FREE_BG_CATEGORIES = new Set(["Gradient", "Mesh", "Aurora", "Sunset", "Ocean", "Neon"]);
const PRO_BG_CATEGORIES = new Set(["Liquid", "Foil", "Nebula"]);
export function bgCategoryTier(category: string): Plan {
  if (PRO_BG_CATEGORIES.has(category)) return "PRO";
  if (FREE_BG_CATEGORIES.has(category)) return "FREE";
  return "PLUS";
}
export function fontCategoryTier(category: string): Plan {
  return category === "Sans" ? "FREE" : "PLUS";
}

export type Background = {
  id: string;
  name: string;
  category: string;
  css: string;
  light?: boolean;
};
export type CardStyle = { id: string; name: string; category: string; className: string };
export type Effect = { id: string; name: string; category: string; className: string };

const H = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

// ---------- Backgrounds (18 categories × 6 = 108) ----------
export const BACKGROUNDS: Background[] = [];
function pushBgs(category: string, items: { css: string; light?: boolean }[]) {
  items.forEach((it, i) =>
    BACKGROUNDS.push({
      id: `${slug(category)}-${i + 1}`,
      name: `${category} ${i + 1}`,
      category,
      css: it.css,
      light: it.light,
    }),
  );
}
const HUES = Array.from({ length: 6 }, (_, i) => i * 60);

pushBgs(
  "Gradient",
  HUES.map((h) => ({
    css: `linear-gradient(150deg, ${H(h, 45, 8)} 0%, ${H((h + 40) % 360, 55, 16)} 100%)`,
  })),
);
pushBgs(
  "Mesh",
  HUES.map((h) => ({
    css: `radial-gradient(at 15% 12%, ${H(h, 70, 18)} 0px, transparent 50%), radial-gradient(at 85% 18%, ${H((h + 50) % 360, 70, 16)} 0px, transparent 45%), radial-gradient(at 50% 95%, ${H((h + 300) % 360, 70, 16)} 0px, transparent 55%), #07070d`,
  })),
);
pushBgs(
  "Aurora",
  Array.from({ length: 6 }, (_, i) => {
    const h = 150 + i * 8;
    return {
      css: `radial-gradient(at 20% 0%, ${H(h, 75, 20)} 0, transparent 50%), radial-gradient(at 80% 12%, ${H(h + 60, 70, 18)} 0, transparent 45%), radial-gradient(at 50% 100%, ${H(h + 120, 70, 16)} 0, transparent 55%), #05060a`,
    };
  }),
);
pushBgs(
  "Sunset",
  Array.from({ length: 6 }, (_, i) => ({
    css: `linear-gradient(160deg, ${H(285, 40, 8)} 0%, ${H(15 + i * 4, 60, 16)} 60%, ${H(40, 72, 18)} 100%)`,
  })),
);
pushBgs(
  "Ocean",
  Array.from({ length: 6 }, (_, i) => {
    const h = 185 + i * 6;
    return { css: `linear-gradient(160deg, ${H(h, 55, 8)} 0%, ${H(h + 20, 60, 16)} 100%)` };
  }),
);
pushBgs(
  "Neon",
  HUES.map((h) => ({
    css: `radial-gradient(70% 60% at 50% 0%, ${H(h, 90, 24)} 0%, transparent 65%), radial-gradient(50% 40% at 90% 100%, ${H((h + 180) % 360, 90, 22)} 0%, transparent 60%), #050507`,
  })),
);
pushBgs(
  "Noir",
  Array.from({ length: 6 }, (_, i) => ({
    css: `linear-gradient(160deg, hsl(240 8% ${4 + i}%), hsl(240 6% ${10 + i}%))`,
  })),
);
pushBgs(
  "Cosmic",
  Array.from({ length: 6 }, (_, i) => {
    const h = 235 + i * 6;
    return {
      css: `radial-gradient(60% 50% at 30% 10%, ${H(h, 60, 16)} 0, transparent 55%), radial-gradient(40% 40% at 80% 80%, ${H(h + 40, 60, 14)} 0, transparent 60%), #03030a`,
    };
  }),
);
pushBgs(
  "Pattern",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 36;
    const kind = i % 3;
    const css =
      kind === 0
        ? `radial-gradient(${H(h, 20, 28)} 1px, transparent 1.6px) 0 0 / 22px 22px, #0a0a12`
        : kind === 1
          ? `linear-gradient(${H(h, 18, 20)} 1px, transparent 1px) 0 0/26px 26px, linear-gradient(90deg, ${H(h, 18, 20)} 1px, transparent 1px) 0 0/26px 26px, #08080f`
          : `repeating-linear-gradient(45deg, ${H(h, 25, 9)} 0 16px, ${H(h, 25, 12)} 16px 32px)`;
    return { css };
  }),
);
pushBgs(
  "Light",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 36;
    return {
      css: `linear-gradient(160deg, ${H(h, 55, 95)} 0%, ${H((h + 30) % 360, 60, 88)} 100%)`,
      light: true,
    };
  }),
);
pushBgs(
  "Synthwave",
  Array.from({ length: 6 }, (_, i) => {
    const h = 300 + i * 8;
    return {
      css: `radial-gradient(80% 55% at 50% 100%, ${H(h, 85, 30)} 0%, transparent 60%), radial-gradient(50% 40% at 50% 88%, ${H((h + 40) % 360, 90, 38)} 0%, transparent 55%), linear-gradient(180deg, ${H(255, 60, 8)} 0%, ${H(280, 55, 12)} 60%, ${H(h, 70, 14)} 100%)`,
    };
  }),
);
pushBgs(
  "Ember",
  Array.from({ length: 6 }, (_, i) => {
    const h = 8 + i * 4;
    return {
      css: `radial-gradient(70% 60% at 50% 110%, ${H(h, 90, 28)} 0%, transparent 60%), radial-gradient(40% 35% at 25% 90%, ${H((h + 18) % 360, 85, 24)} 0%, transparent 55%), linear-gradient(180deg, ${H(18, 30, 5)} 0%, ${H(12, 45, 9)} 100%)`,
    };
  }),
);
pushBgs(
  "Forest",
  Array.from({ length: 6 }, (_, i) => {
    const h = 120 + i * 8;
    return {
      css: `radial-gradient(60% 50% at 20% 10%, ${H(h, 50, 16)} 0%, transparent 55%), radial-gradient(55% 45% at 85% 90%, ${H((h + 30) % 360, 45, 13)} 0%, transparent 60%), linear-gradient(165deg, ${H(150, 35, 6)} 0%, ${H(h, 40, 10)} 100%)`,
    };
  }),
);
pushBgs(
  "Holographic",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 45;
    return {
      css: `linear-gradient(125deg, ${H(h, 70, 16)} 0%, ${H((h + 60) % 360, 70, 18)} 30%, ${H((h + 140) % 360, 70, 16)} 55%, ${H((h + 220) % 360, 70, 18)} 80%, ${H((h + 300) % 360, 70, 16)} 100%)`,
    };
  }),
);
pushBgs(
  "Royal",
  Array.from({ length: 6 }, (_, i) => {
    const h = 260 + i * 4;
    return {
      css: `radial-gradient(60% 50% at 50% 0%, ${H(h, 55, 20)} 0%, transparent 55%), radial-gradient(40% 35% at 85% 95%, ${H(42, 70, 18)} 0%, transparent 55%), linear-gradient(165deg, ${H(h, 45, 7)} 0%, ${H(h - 10, 40, 12)} 100%)`,
    };
  }),
);
pushBgs(
  "Candy",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 45;
    return {
      css: `radial-gradient(60% 50% at 15% 15%, ${H(h, 85, 80)} 0%, transparent 55%), radial-gradient(60% 50% at 85% 80%, ${H((h + 80) % 360, 85, 82)} 0%, transparent 55%), linear-gradient(160deg, ${H((h + 40) % 360, 70, 90)} 0%, ${H((h + 160) % 360, 70, 86)} 100%)`,
      light: true,
    };
  }),
);
pushBgs(
  "Mono",
  Array.from({ length: 6 }, (_, i) => {
    const l = 6 + i * 1.5;
    return { css: `linear-gradient(160deg, hsl(220 6% ${l}%) 0%, hsl(220 5% ${l + 6}%) 100%)` };
  }),
);
pushBgs(
  "Vapor",
  Array.from({ length: 6 }, (_, i) => {
    const h = 180 + i * 22;
    return {
      css: `radial-gradient(55% 45% at 25% 15%, ${H(h, 45, 22)} 0%, transparent 55%), radial-gradient(55% 45% at 80% 85%, ${H((h + 90) % 360, 45, 22)} 0%, transparent 55%), linear-gradient(160deg, ${H(h - 20, 25, 9)} 0%, ${H(h + 40, 25, 12)} 100%)`,
    };
  }),
);
// ---- Pro-exclusive background categories ----
pushBgs(
  "Liquid",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 60;
    return {
      css: `radial-gradient(40% 55% at 22% 30%, ${H(h, 80, 26)} 0%, transparent 55%), radial-gradient(45% 50% at 78% 40%, ${H((h + 70) % 360, 80, 24)} 0%, transparent 55%), radial-gradient(50% 55% at 55% 92%, ${H((h + 160) % 360, 80, 24)} 0%, transparent 60%), radial-gradient(40% 40% at 90% 90%, ${H((h + 240) % 360, 80, 22)} 0%, transparent 55%), #06060c`,
    };
  }),
);
pushBgs(
  "Foil",
  Array.from({ length: 6 }, (_, i) => {
    const h = i * 60;
    return {
      css: `repeating-linear-gradient(115deg, ${H(h, 55, 16)} 0 8%, ${H((h + 45) % 360, 55, 22)} 12%, ${H((h + 120) % 360, 55, 16)} 20%, ${H((h + 200) % 360, 55, 22)} 28%, ${H(h, 55, 16)} 36%)`,
    };
  }),
);
pushBgs(
  "Nebula",
  Array.from({ length: 6 }, (_, i) => {
    const h = 250 + i * 12;
    return {
      css: `radial-gradient(50% 45% at 30% 25%, ${H(h, 70, 22)} 0%, transparent 55%), radial-gradient(45% 45% at 75% 60%, ${H((h + 80) % 360, 65, 20)} 0%, transparent 55%), radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 70% 65%, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 45% 80%, rgba(255,255,255,0.5), transparent), linear-gradient(160deg, ${H(h - 20, 55, 6)}, ${H(h + 30, 55, 10)})`,
    };
  }),
);

// ---------- Card styles (24, 6 categories) ----------
export const CARD_STYLES: CardStyle[] = [
  { id: "solid-surface", name: "Surface", category: "Solid", className: "cs-surface" },
  { id: "solid-deep", name: "Deep", category: "Solid", className: "cs-deep" },
  { id: "solid-invert", name: "Inverted", category: "Solid", className: "cs-invert" },
  { id: "solid-tint", name: "Tinted", category: "Solid", className: "cs-tint" },
  { id: "glass-soft", name: "Glass", category: "Glass", className: "cs-glass" },
  { id: "glass-frost", name: "Frost", category: "Glass", className: "cs-frost" },
  { id: "glass-smoke", name: "Smoke", category: "Glass", className: "cs-smoke" },
  { id: "glass-clear", name: "Clear", category: "Glass", className: "cs-clear" },
  { id: "out-hair", name: "Hairline", category: "Outline", className: "cs-hair" },
  { id: "out-bold", name: "Bold", category: "Outline", className: "cs-bold" },
  { id: "out-primary", name: "Primary", category: "Outline", className: "cs-primary" },
  { id: "out-dashed", name: "Dashed", category: "Outline", className: "cs-dashed" },
  { id: "elev-soft", name: "Soft", category: "Elevated", className: "cs-soft" },
  { id: "elev-float", name: "Float", category: "Elevated", className: "cs-floaty" },
  { id: "elev-pop", name: "Pop", category: "Elevated", className: "cs-pop" },
  { id: "elev-lift", name: "Lifted", category: "Elevated", className: "cs-lift" },
  { id: "grad-aurora", name: "Aurora", category: "Gradient", className: "cs-grad-aurora" },
  { id: "grad-sunset", name: "Sunset", category: "Gradient", className: "cs-grad-sunset" },
  { id: "grad-ocean", name: "Ocean", category: "Gradient", className: "cs-grad-ocean" },
  { id: "grad-violet", name: "Violet", category: "Gradient", className: "cs-grad-violet" },
  { id: "neon-ring", name: "Neon ring", category: "Neon", className: "cs-neon-ring" },
  { id: "neon-glow", name: "Glow", category: "Neon", className: "cs-neon-glow" },
  { id: "neon-cyber", name: "Cyber", category: "Neon", className: "cs-neon-cyber" },
  { id: "neon-magenta", name: "Magenta", category: "Neon", className: "cs-neon-magenta" },
  { id: "brutal-hard", name: "Hard", category: "Brutalist", className: "cs-brutal" },
  { id: "brutal-accent", name: "Accent", category: "Brutalist", className: "cs-brutal-accent" },
  { id: "brutal-mono", name: "Mono", category: "Brutalist", className: "cs-brutal-mono" },
  { id: "retro-double", name: "Double", category: "Retro", className: "cs-retro-double" },
  { id: "retro-inset", name: "Inset", category: "Retro", className: "cs-retro-inset" },
  { id: "retro-stripe", name: "Stripe", category: "Retro", className: "cs-retro-stripe" },
  { id: "sp-sticker", name: "Sticker", category: "Special", className: "cs-sp-sticker" },
  { id: "sp-ticket", name: "Ticket", category: "Special", className: "cs-sp-ticket" },
  { id: "sp-slant", name: "Slanted", category: "Special", className: "cs-sp-slant" },
  { id: "sp-underline", name: "Underline", category: "Special", className: "cs-sp-underline" },
  { id: "sp-3d", name: "3D press", category: "Special", className: "cs-sp-3d" },
  { id: "sp-aurora-edge", name: "Aurora edge", category: "Special", className: "cs-sp-aurora-edge" },
];

// ---------- Button effects (24) ----------
export const BUTTON_FX: Effect[] = [
  { id: "scale", name: "Scale", category: "Motion", className: "bh-scale" },
  { id: "lift", name: "Lift", category: "Motion", className: "bh-lift" },
  { id: "press", name: "Press", category: "Motion", className: "bh-press" },
  { id: "slide", name: "Slide", category: "Motion", className: "bh-slide" },
  { id: "tilt", name: "Tilt", category: "Motion", className: "bh-tilt" },
  { id: "skew", name: "Skew", category: "Motion", className: "bh-skew" },
  { id: "popup", name: "Pop up", category: "Motion", className: "bh-popup" },
  { id: "shrink", name: "Shrink", category: "Motion", className: "bh-shrink" },
  { id: "brighten", name: "Brighten", category: "Light", className: "bh-brighten" },
  { id: "saturate", name: "Saturate", category: "Light", className: "bh-saturate" },
  { id: "fade", name: "Fade", category: "Light", className: "bh-fade" },
  { id: "glow", name: "Glow", category: "Glow", className: "bh-glow" },
  { id: "shadow", name: "Shadow", category: "Glow", className: "bh-shadow" },
  { id: "underglow", name: "Underglow", category: "Glow", className: "bh-underglow" },
  { id: "growglow", name: "Grow + glow", category: "Glow", className: "bh-growglow" },
  { id: "ring", name: "Ring", category: "Glow", className: "bh-ring" },
  { id: "outline", name: "Outline", category: "Glow", className: "bh-outline" },
  { id: "shine", name: "Shine", category: "Animated", className: "bh-shine" },
  { id: "pulse", name: "Pulse", category: "Animated", className: "bh-pulse" },
  { id: "wobble", name: "Wobble", category: "Animated", className: "bh-wobble" },
  { id: "bounce", name: "Bounce", category: "Animated", className: "bh-bounce" },
  { id: "jelly", name: "Jelly", category: "Animated", className: "bh-jelly" },
  { id: "expand", name: "Expand", category: "Motion", className: "bh-expand" },
  { id: "magnetic", name: "Magnetic", category: "Motion", className: "bh-magnetic" },
  { id: "depth", name: "Depth", category: "Glow", className: "bh-depth" },
  { id: "glitch", name: "Glitch", category: "Creative", className: "bh-glitch" },
  { id: "rainbow", name: "Rainbow", category: "Creative", className: "bh-rainbow" },
  { id: "liquid", name: "Liquid", category: "Creative", className: "bh-liquid" },
  { id: "neonflicker", name: "Neon flicker", category: "Creative", className: "bh-neonflicker" },
];

// ---------- Button idle animations (continuous) ----------
export const BUTTON_IDLE: Effect[] = [
  { id: "float", name: "Float", category: "Idle", className: "bi-float" },
  { id: "pulse", name: "Pulse", category: "Idle", className: "bi-pulse" },
  { id: "bounce", name: "Bounce", category: "Idle", className: "bi-bounce" },
  { id: "breathe", name: "Breathe", category: "Idle", className: "bi-breathe" },
  { id: "sway", name: "Sway", category: "Idle", className: "bi-sway" },
  { id: "wobble", name: "Wobble", category: "Idle", className: "bi-wobble" },
  { id: "drift", name: "Drift", category: "Idle", className: "bi-drift" },
];

// ---------- Icon effects (16) ----------
export const ICON_FX: Effect[] = [
  { id: "i-scale", name: "Scale", category: "Motion", className: "ih-scale" },
  { id: "i-pop", name: "Pop", category: "Motion", className: "ih-pop" },
  { id: "i-lift", name: "Lift", category: "Motion", className: "ih-lift" },
  { id: "i-drop", name: "Drop", category: "Motion", className: "ih-drop" },
  { id: "i-spin", name: "Spin", category: "Motion", className: "ih-spin" },
  { id: "i-tilt", name: "Tilt", category: "Motion", className: "ih-tilt" },
  { id: "i-flip", name: "Flip", category: "Motion", className: "ih-flip" },
  { id: "i-color", name: "Color", category: "Color", className: "ih-color" },
  { id: "i-fade", name: "Fade", category: "Color", className: "ih-fade" },
  { id: "i-glow", name: "Glow", category: "Color", className: "ih-glow" },
  { id: "i-growcolor", name: "Grow color", category: "Color", className: "ih-growcolor" },
  { id: "i-wiggle", name: "Wiggle", category: "Animated", className: "ih-wiggle" },
  { id: "i-bounce", name: "Bounce", category: "Animated", className: "ih-bounce" },
  { id: "i-pulse", name: "Pulse", category: "Animated", className: "ih-pulse" },
  { id: "i-shake", name: "Shake", category: "Animated", className: "ih-shake" },
];

// ---------- Icon idle animations (continuous) ----------
export const ICON_IDLE: Effect[] = [
  { id: "float", name: "Float", category: "Idle", className: "ii-float" },
  { id: "pulse", name: "Pulse", category: "Idle", className: "ii-pulse" },
  { id: "bounce", name: "Bounce", category: "Idle", className: "ii-bounce" },
  { id: "sway", name: "Sway", category: "Idle", className: "ii-sway" },
  { id: "spin", name: "Spin", category: "Idle", className: "ii-spin" },
  { id: "wobble", name: "Wobble", category: "Idle", className: "ii-wobble" },
  { id: "breathe", name: "Breathe", category: "Idle", className: "ii-breathe" },
  { id: "drift", name: "Drift", category: "Idle", className: "ii-drift" },
];

// ---------- Background effects (12) ----------
export const BG_FX: Effect[] = [
  { id: "none", name: "None", category: "Overlay", className: "" },
  { id: "vignette", name: "Vignette", category: "Overlay", className: "bgfx-vignette" },
  { id: "topfade", name: "Top fade", category: "Overlay", className: "bgfx-topfade" },
  { id: "bottomfade", name: "Bottom fade", category: "Overlay", className: "bgfx-bottomfade" },
  { id: "frame", name: "Frame", category: "Overlay", className: "bgfx-frame" },
  { id: "haze", name: "Haze", category: "Overlay", className: "bgfx-haze" },
  { id: "topglow", name: "Top glow", category: "Glow", className: "bgfx-topglow" },
  { id: "spotlight", name: "Spotlight", category: "Glow", className: "bgfx-spotlight" },
  { id: "edges", name: "Glow edges", category: "Glow", className: "bgfx-edges" },
  { id: "sideglow", name: "Side glow", category: "Glow", className: "bgfx-sideglow" },
  { id: "underglow", name: "Under glow", category: "Glow", className: "bgfx-underglow" },
  { id: "grain", name: "Grain", category: "Texture", className: "bgfx-grain" },
  { id: "scanlines", name: "Scanlines", category: "Texture", className: "bgfx-scanlines" },
  { id: "grid", name: "Grid", category: "Texture", className: "bgfx-grid" },
  { id: "dots", name: "Dots", category: "Texture", className: "bgfx-dots" },
  { id: "aurora", name: "Aurora drift", category: "Animated", className: "bgfx-aurora" },
  { id: "shimmer", name: "Shimmer", category: "Animated", className: "bgfx-shimmer" },
  { id: "pulse", name: "Pulse glow", category: "Animated", className: "bgfx-pulse" },
  { id: "starfield", name: "Starfield", category: "Texture", className: "bgfx-starfield" },
  { id: "halftone", name: "Halftone", category: "Texture", className: "bgfx-halftone" },
  { id: "beam", name: "Light beam", category: "Glow", className: "bgfx-beam" },
  { id: "meshmove", name: "Mesh drift", category: "Animated", className: "bgfx-meshmove" },
  { id: "rotate", name: "Rotate glow", category: "Animated", className: "bgfx-rotate" },
  { id: "stardrift", name: "Star drift", category: "Animated", className: "bgfx-stardrift" },
  { id: "gridpersp", name: "Retro grid", category: "Creative", className: "bgfx-gridpersp" },
  { id: "orbs", name: "Floating orbs", category: "Creative", className: "bgfx-orbs" },
  { id: "aurorawave", name: "Aurora waves", category: "Creative", className: "bgfx-aurorawave" },
  { id: "rays", name: "Light rays", category: "Creative", className: "bgfx-rays" },
  { id: "blobs", name: "Lava blobs", category: "Creative", className: "bgfx-blobs" },
  { id: "sparkle", name: "Sparkle", category: "Creative", className: "bgfx-sparkle" },
  { id: "cursorglow", name: "Cursor glow", category: "Interactive", className: "bgfx-cursorglow" },
  { id: "cursorgrid", name: "Cursor grid", category: "Interactive", className: "bgfx-cursorgrid" },
  { id: "cursorspot", name: "Cursor spotlight", category: "Interactive", className: "bgfx-cursorspot" },
];

/** Effects that follow the pointer — rendered through <CursorFx>. */
export const INTERACTIVE_BG_FX = new Set(["cursorglow", "cursorgrid", "cursorspot"]);

export const LIGHT_VARS: Record<string, string> = {
  "--text": "#1c1a17",
  "--text-muted": "#6b6b6b",
  "--surface": "#ffffff",
  "--surface-2": "#f3f1ec",
  "--border": "rgba(0,0,0,0.12)",
  // Adaptive effect palette: on light backgrounds, textures draw in dark ink
  // and glows are darkened (mixed toward black) instead of lifted toward white.
  "--fx-ink": "#000",
  "--fx-lift": "#000",
};

// ---------- Layout & shape dimensions (max-customization) ----------
export type LayoutChoice = { id: string; name: string };

/** Corner radius of link buttons. Default (undefined) = pill. */
export const BUTTON_SHAPES: LayoutChoice[] = [
  { id: "pill", name: "Pill" },
  { id: "rounded", name: "Rounded" },
  { id: "soft", name: "Soft" },
  { id: "sharp", name: "Sharp" },
  { id: "leaf", name: "Leaf" },
  { id: "slant", name: "Slant" },
];
export const BUTTON_SHAPE_CLASS: Record<string, string> = {
  pill: "rounded-full",
  rounded: "rounded-2xl",
  soft: "rounded-xl",
  sharp: "rounded-none",
  leaf: "rounded-tl-3xl rounded-br-3xl rounded-tr-md rounded-bl-md",
  slant: "shape-slant",
};

/** Special shapes are Plus; the classic four are free. */
export function shapeTier(id: string): Plan {
  return id === "leaf" || id === "slant" ? "PLUS" : "FREE";
}

/** The Special button-style category is a Pro exclusive. */
export function cardCategoryTier(category: string): Plan {
  return category === "Special" ? "PRO" : "FREE";
}

/** Creative and pointer-interactive background effects are Plus. */
export function bgFxCategoryTier(category: string): Plan {
  return category === "Creative" || category === "Interactive" ? "PLUS" : "FREE";
}

/** Height/padding of link buttons. Default (undefined) = medium. */
export const BUTTON_SIZES: LayoutChoice[] = [
  { id: "sm", name: "Small" },
  { id: "md", name: "Medium" },
  { id: "lg", name: "Large" },
];
export const BUTTON_SIZE_CLASS: Record<string, string> = {
  sm: "h-10 text-sm",
  md: "h-12 text-sm",
  lg: "h-14 text-base",
};

/** Width of the page content column. Default (undefined) = standard. */
export const CONTENT_WIDTHS: LayoutChoice[] = [
  { id: "narrow", name: "Narrow" },
  { id: "standard", name: "Standard" },
  { id: "wide", name: "Wide" },
];
export const CONTENT_WIDTH_CLASS: Record<string, string> = {
  narrow: "max-w-sm",
  standard: "max-w-md",
  wide: "max-w-lg",
};

/** Vertical gap between blocks. Default (undefined) = cozy. */
export const SPACINGS: LayoutChoice[] = [
  { id: "compact", name: "Compact" },
  { id: "cozy", name: "Cozy" },
  { id: "roomy", name: "Roomy" },
];
export const SPACING_CLASS: Record<string, string> = {
  compact: "gap-4",
  cozy: "gap-6",
  roomy: "gap-9",
};

/** Animation speed for idle/background motion. Default = normal. */
export const MOTION_SPEEDS: LayoutChoice[] = [
  { id: "slow", name: "Slow" },
  { id: "normal", name: "Normal" },
  { id: "fast", name: "Fast" },
];
export const MOTION_SPEED_VALUE: Record<string, string> = {
  slow: "1.6",
  normal: "1",
  fast: "0.55",
};

/** Overall typography scale. Default (undefined) = normal (1×). */
export const TEXT_SCALES: LayoutChoice[] = [
  { id: "compact", name: "Compact" },
  { id: "normal", name: "Normal" },
  { id: "large", name: "Large" },
  { id: "xl", name: "Huge" },
];
export const TEXT_SCALE_VALUE: Record<string, string> = {
  compact: "0.9",
  normal: "1",
  large: "1.12",
  xl: "1.25",
};

export function resolveLayout(d?: PageDesign) {
  return {
    buttonShape: d?.buttonShape ? BUTTON_SHAPE_CLASS[d.buttonShape] : undefined,
    buttonSize: d?.buttonSize ? BUTTON_SIZE_CLASS[d.buttonSize] : undefined,
    contentWidth: (d?.contentWidth && CONTENT_WIDTH_CLASS[d.contentWidth]) || "max-w-md",
    spacing: (d?.spacing && SPACING_CLASS[d.spacing]) || "gap-6",
    textScale: (d?.textScale && TEXT_SCALE_VALUE[d.textScale]) || undefined,
    motionSpeed: (d?.motionSpeed && MOTION_SPEED_VALUE[d.motionSpeed]) || undefined,
  };
}

export function resolveDesign(d?: PageDesign) {
  const bg = d?.background ? BACKGROUNDS.find((b) => b.id === d.background) : undefined;
  const card =
    d?.card && d.card !== "none"
      ? CARD_STYLES.find((c) => c.id === d.card)?.className
      : undefined;
  const buttonFx =
    d?.buttonFx && d.buttonFx !== "none"
      ? BUTTON_FX.find((e) => e.id === d.buttonFx)?.className
      : undefined;
  const buttonIdle =
    d?.buttonIdle && d.buttonIdle !== "none"
      ? BUTTON_IDLE.find((e) => e.id === d.buttonIdle)?.className
      : undefined;
  const iconFx =
    d?.iconFx && d.iconFx !== "none"
      ? ICON_FX.find((e) => e.id === d.iconFx)?.className
      : undefined;
  const iconIdle =
    d?.iconIdle && d.iconIdle !== "none"
      ? ICON_IDLE.find((e) => e.id === d.iconIdle)?.className
      : undefined;
  const bgFx =
    d?.bgFx && d.bgFx !== "none"
      ? BG_FX.find((e) => e.id === d.bgFx)?.className
      : undefined;
  return { bg, card, buttonFx, buttonIdle, iconFx, iconIdle, bgFx };
}

export function groupByCategory<T extends { category: string }>(list: T[]) {
  const map = new Map<string, T[]>();
  for (const item of list) {
    const arr = map.get(item.category) ?? [];
    arr.push(item);
    map.set(item.category, arr);
  }
  return Array.from(map.entries());
}

// ---------- Avatar idle animations (reuse the icon idle set) ----------
export const AVATAR_IDLE: Effect[] = ICON_IDLE;

export function avatarIdleClass(id?: string): string | undefined {
  return id && id !== "none" ? ICON_IDLE.find((e) => e.id === id)?.className : undefined;
}

/** Resolve a button hover-effect id to its class (for per-button overrides). */
export function buttonFxClass(id?: string): string | undefined {
  return id && id !== "none" ? BUTTON_FX.find((e) => e.id === id)?.className : undefined;
}

/** Resolve a button idle-animation id to its class (for per-block overrides). */
export function buttonIdleClass(id?: string): string | undefined {
  return id && id !== "none" ? BUTTON_IDLE.find((e) => e.id === id)?.className : undefined;
}

/** Resolve an icon hover-effect id to its class (for per-block overrides). */
export function iconFxClass(id?: string): string | undefined {
  return id && id !== "none" ? ICON_FX.find((e) => e.id === id)?.className : undefined;
}

/** Resolve an icon idle-animation id to its class (for per-block overrides). */
export function iconIdleClass(id?: string): string | undefined {
  return id && id !== "none" ? ICON_IDLE.find((e) => e.id === id)?.className : undefined;
}

// ---------- Accent derived from the chosen background ----------
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/**
 * A companion color for two-tone effects (orbs, mesh, waves…), derived from
 * the page accent by rotating the hue — so effects match the page palette
 * instead of injecting the fixed site accent.
 */
export function secondaryAccent(hex?: string): string | null {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    h =
      max === r ? ((g - b) / d + (g < b ? 6 : 0)) :
      max === g ? (b - r) / d + 2 :
      (r - g) / d + 4;
    h *= 60;
  }
  const l = (max + min) / 2;
  return hslToHex((h + 55) % 360, 75, l < 0.35 ? 45 : l > 0.75 ? 70 : Math.round(l * 100));
}

/** A vivid accent that matches the dominant hue of the chosen background. */
export function accentFromBackground(bgId?: string): string | null {
  const bg = bgId ? BACKGROUNDS.find((b) => b.id === bgId) : undefined;
  if (!bg) return null;
  const m = bg.css.match(/hsl\(\s*(-?\d+(?:\.\d+)?)/);
  const h = m ? Math.round(parseFloat(m[1])) : 160;
  // Light backgrounds need a darker accent for contrast; dark ones a brighter one.
  return hslToHex(((h % 360) + 360) % 360, 82, bg.light ? 44 : 62);
}

// ---------- Preset color themes ----------
export type ColorPreset = {
  id: string;
  name: string;
  accent: string;
  background?: string; // BACKGROUND id
};

// 16 distinct colors; every preset ships a hue-matched background so the page
// always reflects the chosen swatch (no accent-only presets).
export const COLOR_PRESETS: ColorPreset[] = [
  { id: "emerald", name: "Emerald", accent: "#00E5A0", background: "aurora-1" },
  { id: "teal", name: "Teal", accent: "#2DD4BF", background: "vapor-1" },
  { id: "sky", name: "Sky", accent: "#38BDF8", background: "ocean-3" },
  { id: "ocean", name: "Ocean", accent: "#22D3EE", background: "ocean-5" },
  { id: "cobalt", name: "Cobalt", accent: "#3B82F6", background: "gradient-5" },
  { id: "violet", name: "Violet", accent: "#A78BFA", background: "cosmic-3" },
  { id: "grape", name: "Grape", accent: "#C084FC", background: "cosmic-6" },
  { id: "magenta", name: "Magenta", accent: "#F472B6", background: "synthwave-2" },
  { id: "rose", name: "Rose", accent: "#FB7185", background: "neon-1" },
  { id: "crimson", name: "Crimson", accent: "#F43F5E", background: "ember-2" },
  { id: "tangerine", name: "Tangerine", accent: "#FB923C", background: "sunset-4" },
  { id: "gold", name: "Gold", accent: "#FBBF24", background: "royal-3" },
  { id: "lime", name: "Lime", accent: "#A3E635", background: "forest-5" },
  { id: "forest", name: "Forest", accent: "#4ADE80", background: "forest-2" },
  { id: "mono", name: "Mono", accent: "#E5E7EB", background: "mono-3" },
  { id: "candy", name: "Candy", accent: "#EC4899", background: "candy-2" },
];

/** Resolve a preset's background css for swatch display (falls back to default). */
export function presetSwatch(p: ColorPreset): string {
  const bg = p.background ? BACKGROUNDS.find((b) => b.id === p.background) : undefined;
  return bg?.css ?? "linear-gradient(150deg,#0b0b14,#1a1d24)";
}

// ---------- One-click full themes ----------
// 18 complete, hand-tuned profiles. Each sets the FULL look in one tap:
// palette (accent + background + bg effect), button style/shape/size,
// typography, idle motion and hover/icon effects — and every piece stays
// individually editable afterwards. 12 Plus themes + 6 Pro exclusives.
export type FullTheme = {
  id: string;
  name: string;
  accent: string;
  tier: "PLUS" | "PRO";
  design: Partial<PageDesign>;
};

export const FULL_THEMES: FullTheme[] = [
  // ── Plus themes (12) ──────────────────────────────────────────────
  { id: "emerald-night", name: "Emerald Night", accent: "#00E5A0", tier: "PLUS",
    design: { accent: "#00E5A0", background: "aurora-2", bgFx: "topglow", card: "glass-frost", font: "sora", buttonShape: "pill", buttonSize: "md", buttonIdle: "none", buttonFx: "growglow", iconFx: "i-glow", iconIdle: "none", spacing: "cozy" } },
  { id: "cyber-neon", name: "Cyber Neon", accent: "#22D3EE", tier: "PLUS",
    design: { accent: "#22D3EE", background: "neon-4", bgFx: "scanlines", card: "neon-cyber", font: "grotesk", buttonShape: "sharp", buttonSize: "md", buttonIdle: "none", buttonFx: "glitch", iconFx: "i-shake", iconIdle: "none", spacing: "cozy" } },
  { id: "sunset-pop", name: "Sunset Pop", accent: "#FB923C", tier: "PLUS",
    design: { accent: "#FB923C", background: "sunset-4", bgFx: "grain", card: "grad-sunset", font: "outfit", buttonShape: "rounded", buttonSize: "lg", buttonIdle: "none", buttonFx: "magnetic", iconFx: "i-bounce", iconIdle: "none", spacing: "cozy" } },
  { id: "royal-gold", name: "Royal Gold", accent: "#FBBF24", tier: "PLUS",
    design: { accent: "#FBBF24", background: "royal-3", bgFx: "vignette", card: "solid-deep", font: "fraunces", buttonShape: "soft", buttonSize: "md", buttonIdle: "none", buttonFx: "shine", iconFx: "i-color", iconIdle: "none", spacing: "cozy" } },
  { id: "forest-calm", name: "Forest Calm", accent: "#4ADE80", tier: "PLUS",
    design: { accent: "#4ADE80", background: "forest-3", bgFx: "grain", card: "glass-soft", font: "manrope", buttonShape: "rounded", buttonSize: "md", buttonIdle: "none", buttonFx: "lift", iconFx: "i-fade", iconIdle: "none", spacing: "roomy" } },
  { id: "cosmic-violet", name: "Cosmic Violet", accent: "#A78BFA", tier: "PLUS",
    design: { accent: "#A78BFA", background: "cosmic-3", bgFx: "starfield", card: "neon-magenta", font: "syne", buttonShape: "pill", buttonSize: "md", buttonIdle: "none", buttonFx: "growglow", iconFx: "i-glow", iconIdle: "breathe", spacing: "cozy" } },
  { id: "mono-minimal", name: "Mono Minimal", accent: "#E5E7EB", tier: "PLUS",
    design: { accent: "#E5E7EB", background: "mono-3", bgFx: "none", card: "out-hair", font: "inter", buttonShape: "sharp", buttonSize: "sm", buttonIdle: "none", buttonFx: "scale", iconFx: "i-fade", iconIdle: "none", spacing: "roomy", textScale: "compact" } },
  { id: "candy-pop", name: "Candy Pop", accent: "#EC4899", tier: "PLUS",
    design: { accent: "#EC4899", background: "candy-2", bgFx: "none", card: "solid-surface", font: "poppins", buttonShape: "rounded", buttonSize: "md", buttonIdle: "pulse", buttonFx: "bounce", iconFx: "i-wiggle", iconIdle: "none", spacing: "cozy" } },
  { id: "ocean-deep", name: "Ocean Deep", accent: "#38BDF8", tier: "PLUS",
    design: { accent: "#38BDF8", background: "ocean-2", bgFx: "spotlight", card: "glass-smoke", font: "dmsans", buttonShape: "pill", buttonSize: "md", buttonIdle: "none", buttonFx: "underglow", iconFx: "i-lift", iconIdle: "none", spacing: "cozy" } },
  { id: "ember-glow", name: "Ember Glow", accent: "#F43F5E", tier: "PLUS",
    design: { accent: "#F43F5E", background: "ember-2", bgFx: "pulse", card: "neon-glow", font: "archivo", buttonShape: "soft", buttonSize: "md", buttonIdle: "none", buttonFx: "depth", iconFx: "i-growcolor", iconIdle: "none", spacing: "cozy" } },
  { id: "synth-retro", name: "Synth Retro", accent: "#F472B6", tier: "PLUS",
    design: { accent: "#F472B6", background: "synthwave-3", bgFx: "gridpersp", card: "retro-double", font: "grotesk", buttonShape: "sharp", buttonSize: "md", buttonIdle: "none", buttonFx: "neonflicker", iconFx: "i-spin", iconIdle: "none", spacing: "cozy" } },
  { id: "vapor-dream", name: "Vapor Dream", accent: "#67E8F9", tier: "PLUS",
    design: { accent: "#67E8F9", background: "vapor-2", bgFx: "aurorawave", card: "glass-clear", font: "epilogue", buttonShape: "pill", buttonSize: "lg", buttonIdle: "float", buttonFx: "liquid", iconFx: "i-pulse", iconIdle: "float", spacing: "roomy" } },
  // ── Pro exclusives (6) — built on the Pro-only backgrounds ───────
  { id: "liquid-chrome", name: "Liquid Chrome", accent: "#22D3EE", tier: "PRO",
    design: { accent: "#22D3EE", background: "liquid-4", bgFx: "meshmove", card: "glass-frost", font: "outfit", buttonShape: "pill", buttonSize: "lg", buttonIdle: "breathe", buttonFx: "liquid", iconFx: "i-glow", iconIdle: "none", spacing: "cozy" } },
  { id: "molten-foil", name: "Molten Foil", accent: "#FBBF24", tier: "PRO",
    design: { accent: "#FBBF24", background: "foil-2", bgFx: "shimmer", card: "brutal-accent", font: "syne", buttonShape: "sharp", buttonSize: "md", buttonIdle: "none", buttonFx: "glitch", iconFx: "i-shake", iconIdle: "none", spacing: "cozy" } },
  { id: "nebula-night", name: "Nebula Night", accent: "#C084FC", tier: "PRO",
    design: { accent: "#C084FC", background: "nebula-2", bgFx: "starfield", card: "neon-ring", font: "grotesk", buttonShape: "pill", buttonSize: "md", buttonIdle: "none", buttonFx: "rainbow", iconFx: "i-glow", iconIdle: "breathe", spacing: "cozy" } },
  { id: "aurora-flow", name: "Aurora Flow", accent: "#4ADE80", tier: "PRO",
    design: { accent: "#4ADE80", background: "liquid-3", bgFx: "aurorawave", card: "glass-soft", font: "manrope", buttonShape: "rounded", buttonSize: "md", buttonIdle: "none", buttonFx: "magnetic", iconFx: "i-lift", iconIdle: "none", spacing: "roomy" } },
  { id: "foil-noir", name: "Foil Noir", accent: "#E5E7EB", tier: "PRO",
    design: { accent: "#E5E7EB", background: "foil-5", bgFx: "vignette", card: "brutal-mono", font: "jetbrains", buttonShape: "sharp", buttonSize: "sm", buttonIdle: "none", buttonFx: "press", iconFx: "i-flip", iconIdle: "none", spacing: "compact" } },
  { id: "rose-nebula", name: "Rose Nebula", accent: "#FB7185", tier: "PRO",
    design: { accent: "#FB7185", background: "nebula-5", bgFx: "orbs", card: "elev-lift", font: "playfair", buttonShape: "soft", buttonSize: "md", buttonIdle: "none", buttonFx: "jelly", iconFx: "i-tilt", iconIdle: "none", spacing: "cozy" } },
];

/** A swatch gradient for a full theme tile. */
export function fullThemeSwatch(t: FullTheme): string {
  const bg = t.design.background ? BACKGROUNDS.find((b) => b.id === t.design.background) : undefined;
  return bg?.css ?? "linear-gradient(150deg,#0b0b14,#1a1d24)";
}
