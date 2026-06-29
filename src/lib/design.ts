import type { PageDesign } from "@/lib/blocks";

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
  { id: "contrast", name: "Contrast", category: "Light", className: "bh-contrast" },
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
  { id: "gradient", name: "Gradient", category: "Glow", className: "bh-gradient" },
  { id: "sheen", name: "Sheen", category: "Animated", className: "bh-sheen" },
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
  { id: "tilt", name: "Tilt", category: "Idle", className: "bi-tilt" },
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
  { id: "topglow", name: "Top glow", category: "Glow", className: "bgfx-topglow" },
  { id: "spotlight", name: "Spotlight", category: "Glow", className: "bgfx-spotlight" },
  { id: "edges", name: "Glow edges", category: "Glow", className: "bgfx-edges" },
  { id: "grain", name: "Grain", category: "Texture", className: "bgfx-grain" },
  { id: "scanlines", name: "Scanlines", category: "Texture", className: "bgfx-scanlines" },
  { id: "grid", name: "Grid", category: "Texture", className: "bgfx-grid" },
  { id: "dots", name: "Dots", category: "Texture", className: "bgfx-dots" },
  { id: "aurora", name: "Aurora drift", category: "Animated", className: "bgfx-aurora" },
  { id: "shimmer", name: "Shimmer", category: "Animated", className: "bgfx-shimmer" },
  { id: "pulse", name: "Pulse glow", category: "Animated", className: "bgfx-pulse" },
  { id: "starfield", name: "Starfield", category: "Texture", className: "bgfx-starfield" },
  { id: "noisefine", name: "Fine grain", category: "Texture", className: "bgfx-noisefine" },
  { id: "beam", name: "Light beam", category: "Glow", className: "bgfx-beam" },
  { id: "meshmove", name: "Mesh drift", category: "Animated", className: "bgfx-meshmove" },
  { id: "rotate", name: "Rotate glow", category: "Animated", className: "bgfx-rotate" },
  { id: "gridpersp", name: "Retro grid", category: "Creative", className: "bgfx-gridpersp" },
  { id: "orbs", name: "Floating orbs", category: "Creative", className: "bgfx-orbs" },
  { id: "aurorawave", name: "Aurora waves", category: "Creative", className: "bgfx-aurorawave" },
];

export const LIGHT_VARS: Record<string, string> = {
  "--text": "#1c1a17",
  "--text-muted": "#6b6b6b",
  "--surface": "#ffffff",
  "--surface-2": "#f3f1ec",
  "--border": "rgba(0,0,0,0.12)",
};

// ---------- Layout & shape dimensions (max-customization) ----------
export type LayoutChoice = { id: string; name: string };

/** Corner radius of link buttons. Default (undefined) = pill. */
export const BUTTON_SHAPES: LayoutChoice[] = [
  { id: "pill", name: "Pill" },
  { id: "rounded", name: "Rounded" },
  { id: "soft", name: "Soft" },
  { id: "sharp", name: "Sharp" },
];
export const BUTTON_SHAPE_CLASS: Record<string, string> = {
  pill: "rounded-full",
  rounded: "rounded-2xl",
  soft: "rounded-xl",
  sharp: "rounded-none",
};

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

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "emerald", name: "Emerald", accent: "#00E5A0" },
  { id: "ocean", name: "Ocean", accent: "#22D3EE", background: "ocean-4" },
  { id: "aurora", name: "Aurora", accent: "#34D399", background: "aurora-2" },
  { id: "cosmic", name: "Cosmic", accent: "#A78BFA", background: "cosmic-3" },
  { id: "sunset", name: "Sunset", accent: "#FB923C", background: "sunset-6" },
  { id: "rose", name: "Rose", accent: "#FB7185", background: "neon-1" },
  { id: "gold", name: "Gold", accent: "#FBBF24", background: "noir-5" },
  { id: "grape", name: "Grape", accent: "#C084FC", background: "cosmic-5" },
  { id: "sky", name: "Sky", accent: "#38BDF8", background: "ocean-1" },
  { id: "daylight", name: "Daylight", accent: "#7C3AED", background: "light-3" },
  { id: "synth", name: "Synth", accent: "#F472B6", background: "synthwave-3" },
  { id: "ember", name: "Ember", accent: "#FB923C", background: "ember-4" },
  { id: "forest", name: "Forest", accent: "#4ADE80", background: "forest-3" },
  { id: "holo", name: "Holo", accent: "#22D3EE", background: "holographic-2" },
  { id: "regal", name: "Regal", accent: "#FBBF24", background: "royal-4" },
  { id: "candy", name: "Candy", accent: "#EC4899", background: "candy-2" },
  { id: "mono", name: "Mono", accent: "#E5E7EB", background: "mono-3" },
  { id: "vapor", name: "Vapor", accent: "#67E8F9", background: "vapor-2" },
  { id: "lime", name: "Lime", accent: "#A3E635", background: "forest-5" },
  { id: "crimson", name: "Crimson", accent: "#F43F5E", background: "ember-2" },
];

/** Resolve a preset's background css for swatch display (falls back to default). */
export function presetSwatch(p: ColorPreset): string {
  const bg = p.background ? BACKGROUNDS.find((b) => b.id === p.background) : undefined;
  return bg?.css ?? "linear-gradient(150deg,#0b0b14,#1a1d24)";
}

// ---------- One-click full themes ----------
// Each applies a complete, hand-tuned look in a single tap: accent, background,
// card style, font, hover effect, background effect, and button shape — chosen
// so they never clash.
export type FullTheme = { id: string; name: string; accent: string; design: Partial<PageDesign> };

export const FULL_THEMES: FullTheme[] = [
  { id: "emerald-night", name: "Emerald Night", accent: "#00E5A0",
    design: { accent: "#00E5A0", background: "aurora-2", card: "glass-frost", font: "sora", buttonFx: "growglow", bgFx: "topglow", buttonShape: "pill" } },
  { id: "sunset-pop", name: "Sunset Pop", accent: "#FB923C",
    design: { accent: "#FB923C", background: "sunset-4", card: "grad-sunset", font: "outfit", buttonFx: "magnetic", bgFx: "grain", buttonShape: "rounded" } },
  { id: "cyber-neon", name: "Cyber Neon", accent: "#22D3EE",
    design: { accent: "#22D3EE", background: "neon-1", card: "neon-cyber", font: "grotesk", buttonFx: "glow", bgFx: "scanlines", buttonShape: "sharp" } },
  { id: "royal-gold", name: "Royal Gold", accent: "#FBBF24",
    design: { accent: "#FBBF24", background: "royal-3", card: "solid-deep", font: "fraunces", buttonFx: "sheen", bgFx: "vignette", buttonShape: "soft" } },
  { id: "forest-calm", name: "Forest Calm", accent: "#4ADE80",
    design: { accent: "#4ADE80", background: "forest-3", card: "glass-soft", font: "manrope", buttonFx: "lift", bgFx: "noisefine", buttonShape: "rounded" } },
  { id: "cosmic-violet", name: "Cosmic Violet", accent: "#A78BFA",
    design: { accent: "#A78BFA", background: "cosmic-3", card: "neon-magenta", font: "syne", buttonFx: "growglow", bgFx: "starfield", buttonShape: "pill" } },
  { id: "mono-minimal", name: "Mono Minimal", accent: "#E5E7EB",
    design: { accent: "#E5E7EB", background: "mono-3", card: "out-hair", font: "inter", buttonFx: "scale", bgFx: "none", buttonShape: "sharp" } },
  { id: "candy-light", name: "Candy Light", accent: "#EC4899",
    design: { accent: "#EC4899", background: "candy-2", card: "solid-surface", font: "poppins", buttonFx: "bounce", bgFx: "none", buttonShape: "rounded" } },
  { id: "ocean-deep", name: "Ocean Deep", accent: "#38BDF8",
    design: { accent: "#38BDF8", background: "ocean-2", card: "glass-smoke", font: "dmsans", buttonFx: "underglow", bgFx: "spotlight", buttonShape: "pill" } },
  { id: "ember-glow", name: "Ember Glow", accent: "#F43F5E",
    design: { accent: "#F43F5E", background: "ember-2", card: "neon-glow", font: "archivo", buttonFx: "depth", bgFx: "pulse", buttonShape: "soft" } },
];

/** A swatch gradient for a full theme tile. */
export function fullThemeSwatch(t: FullTheme): string {
  const bg = t.design.background ? BACKGROUNDS.find((b) => b.id === t.design.background) : undefined;
  return bg?.css ?? "linear-gradient(150deg,#0b0b14,#1a1d24)";
}
