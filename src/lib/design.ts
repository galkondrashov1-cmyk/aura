// הילה — the design system a business owner picks from.
// A site's design is a small JSON object; every option is defined here once
// and rendered by PublicSite + the editor preview. Plan gating happens at
// render time via resolveDesign() so a downgraded plan instantly falls back.
import { caps, type Plan } from "@/lib/plans";

export type SiteDesign = {
  theme: string;
  background: string;
  accent: string;
  font: string;
  button: string; // shape: rounded | pill | sharp
  buttonFill: string; // solid | outline | soft | glow
  corners: string; // sm | lg | xl
  effects: string; // none | fade | rise | halo
};

export const DEFAULT_DESIGN: SiteDesign = {
  theme: "or",
  background: "light",
  accent: "#d97706",
  font: "heebo",
  button: "rounded",
  buttonFill: "solid",
  corners: "lg",
  effects: "none",
};

// ── Backgrounds ────────────────────────────────────────────────────────────
export type BackgroundDef = {
  id: string;
  name: string;
  free?: boolean;
  mode: "light" | "dark"; // drives text/surface colors
  css: string; // value for the `background` shorthand
  animated?: boolean; // gets the bg-animated class (gradient drift)
  halo?: boolean; // floating glow orbs layer
};

export const BACKGROUNDS: BackgroundDef[] = [
  { id: "light", name: "בהיר", free: true, mode: "light", css: "#faf9f7" },
  { id: "dark", name: "כהה", free: true, mode: "dark", css: "#0d0f14" },
  { id: "cream", name: "שמנת", free: true, mode: "light", css: "#f6f1e7" },
  { id: "sky-soft", name: "תכלת רך", free: true, mode: "light", css: "linear-gradient(160deg,#eef4fb 0%,#e3ecf7 100%)" },
  // — paid: gradients —
  { id: "sunset", name: "שקיעה", mode: "dark", css: "linear-gradient(160deg,#2b1055 0%,#7597de00 200%),linear-gradient(200deg,#1a0b2e 0%,#5b2333 55%,#b4654a 130%)" },
  { id: "ocean", name: "ים", mode: "dark", css: "linear-gradient(165deg,#04202c 0%,#0a4d68 60%,#088395 115%)" },
  { id: "forest", name: "יער", mode: "dark", css: "linear-gradient(170deg,#0b1f16 0%,#123524 60%,#1e5138 120%)" },
  { id: "royal", name: "מלכותי", mode: "dark", css: "linear-gradient(160deg,#12101f 0%,#241b4d 60%,#3b2d7a 120%)" },
  { id: "blush", name: "סומק", mode: "light", css: "linear-gradient(160deg,#fdf3f0 0%,#fbe4e6 55%,#f6d5e2 110%)" },
  { id: "sand", name: "חול", mode: "light", css: "linear-gradient(165deg,#f9f4ec 0%,#efe3cf 70%,#e7d3b3 120%)" },
  { id: "mint", name: "מנטה", mode: "light", css: "linear-gradient(160deg,#f0faf5 0%,#dcf2e6 60%,#c5e8d6 115%)" },
  { id: "graphite", name: "גרפיט", mode: "dark", css: "linear-gradient(180deg,#17191d 0%,#232730 100%)" },
  // — paid: patterns —
  { id: "dots-light", name: "נקודות", mode: "light", css: "radial-gradient(circle at 1px 1px, #d4cfc5 1.2px, transparent 0) 0 0/22px 22px, #faf8f4" },
  { id: "dots-dark", name: "נקודות לילה", mode: "dark", css: "radial-gradient(circle at 1px 1px, #2e3340 1.2px, transparent 0) 0 0/22px 22px, #0e1015" },
  { id: "grid-light", name: "רשת", mode: "light", css: "linear-gradient(#e8e4dc 1px, transparent 1px) 0 0/28px 28px, linear-gradient(90deg,#e8e4dc 1px, transparent 1px) 0 0/28px 28px, #fbfaf7" },
  { id: "grid-dark", name: "רשת לילה", mode: "dark", css: "linear-gradient(#1e2230 1px, transparent 1px) 0 0/28px 28px, linear-gradient(90deg,#1e2230 1px, transparent 1px) 0 0/28px 28px, #0c0e13" },
  // — paid: animated —
  { id: "aurora", name: "זוהר צפוני", mode: "dark", animated: true, css: "linear-gradient(230deg,#071a2b,#123a2e,#2b1055,#071a2b) 0 0/300% 300%" },
  { id: "dawn", name: "זריחה", mode: "light", animated: true, css: "linear-gradient(230deg,#fdf1e3,#fbe0e6,#e8ecfb,#fdf1e3) 0 0/300% 300%" },
  { id: "ember", name: "גחלים", mode: "dark", animated: true, css: "linear-gradient(230deg,#1a0b0b,#3d1308,#5b2333,#1a0b0b) 0 0/300% 300%" },
  // — paid: halo (the signature look) —
  { id: "halo-night", name: "הילה — לילה", mode: "dark", halo: true, css: "#0b0d13" },
  { id: "halo-day", name: "הילה — יום", mode: "light", halo: true, css: "#faf8f5" },
];

export function background(id: string): BackgroundDef {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}

// ── Fonts (Hebrew) — CSS variables are declared in src/lib/fonts.ts ───────
export type FontDef = { id: string; name: string; variable: string; free?: boolean };

export const FONTS: FontDef[] = [
  { id: "heebo", name: "Heebo — נקי ומודרני", variable: "--font-heebo", free: true },
  { id: "assistant", name: "Assistant — קליל", variable: "--font-assistant", free: true },
  { id: "rubik", name: "Rubik — עגלגל", variable: "--font-rubik" },
  { id: "varela", name: "Varela Round — רך", variable: "--font-varela" },
  { id: "secular", name: "Secular One — בולט", variable: "--font-secular" },
  { id: "frank", name: "Frank Ruhl — קלאסי", variable: "--font-frank" },
  { id: "suez", name: "Suez One — כותרתי", variable: "--font-suez" },
  { id: "miriam", name: "Miriam Libre — עדין", variable: "--font-miriam" },
  { id: "alef", name: "Alef — פשוט", variable: "--font-alef" },
  { id: "david", name: "David Libre — ספרותי", variable: "--font-david" },
];

export function font(id: string): FontDef {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

// ── Buttons ────────────────────────────────────────────────────────────────
export type OptionDef = { id: string; name: string; free?: boolean; radius?: string };

export const BUTTON_SHAPES: OptionDef[] = [
  { id: "rounded", name: "מעוגל", free: true, radius: "0.9rem" },
  { id: "pill", name: "גלולה", free: true, radius: "999px" },
  { id: "sharp", name: "חד", radius: "0.15rem" },
];

export const BUTTON_FILLS: OptionDef[] = [
  { id: "solid", name: "מלא", free: true },
  { id: "outline", name: "קו מתאר" },
  { id: "soft", name: "רך" },
  { id: "glow", name: "זוהר" },
];

export const CORNERS: OptionDef[] = [
  { id: "sm", name: "עדין", radius: "0.5rem" },
  { id: "lg", name: "בינוני", radius: "1rem" },
  { id: "xl", name: "מעוגל", radius: "1.75rem" },
];

export const EFFECTS: OptionDef[] = [
  { id: "none", name: "ללא", free: true },
  { id: "fade", name: "הופעה עדינה" },
  { id: "rise", name: "עלייה" },
  { id: "halo", name: "פעימת הילה" },
];

// ── Accent palette (suggestions; any hex is allowed) ──────────────────────
export const ACCENTS = [
  "#d97706", "#e11d48", "#db2777", "#7c3aed", "#4f46e5",
  "#0284c7", "#0d9488", "#16a34a", "#ca8a04", "#dc2626",
  "#f0b429", "#8b7cf6",
];

// ── Theme presets — one-click bundles ──────────────────────────────────────
export type ThemeDef = {
  id: string;
  name: string;
  free?: boolean;
  design: Omit<SiteDesign, "theme">;
};

export const THEMES: ThemeDef[] = [
  { id: "or", name: "אוֹר", free: true, design: { background: "light", accent: "#d97706", font: "heebo", button: "rounded", buttonFill: "solid", corners: "lg", effects: "none" } },
  { id: "layla", name: "לילה", free: true, design: { background: "dark", accent: "#8b7cf6", font: "heebo", button: "rounded", buttonFill: "solid", corners: "lg", effects: "none" } },
  { id: "naki", name: "נקי", free: true, design: { background: "cream", accent: "#0d9488", font: "assistant", button: "pill", buttonFill: "solid", corners: "sm", effects: "none" } },
  { id: "shkia", name: "שקיעה", design: { background: "sunset", accent: "#fb923c", font: "rubik", button: "pill", buttonFill: "glow", corners: "xl", effects: "fade" } },
  { id: "yam", name: "ים", design: { background: "ocean", accent: "#38bdf8", font: "assistant", button: "rounded", buttonFill: "soft", corners: "lg", effects: "rise" } },
  { id: "yaar", name: "יער", design: { background: "forest", accent: "#4ade80", font: "varela", button: "rounded", buttonFill: "outline", corners: "lg", effects: "fade" } },
  { id: "zahav", name: "זהב", design: { background: "sand", accent: "#b45309", font: "frank", button: "sharp", buttonFill: "outline", corners: "sm", effects: "fade" } },
  { id: "pastel", name: "פסטל", design: { background: "blush", accent: "#db2777", font: "varela", button: "pill", buttonFill: "soft", corners: "xl", effects: "rise" } },
  { id: "melech", name: "מלכותי", design: { background: "royal", accent: "#c4b5fd", font: "suez", button: "rounded", buttonFill: "glow", corners: "lg", effects: "halo" } },
  { id: "zohar", name: "זוהר צפוני", design: { background: "aurora", accent: "#5eead4", font: "heebo", button: "pill", buttonFill: "glow", corners: "xl", effects: "fade" } },
  { id: "hila-night", name: "הילה — לילה", design: { background: "halo-night", accent: "#f0b429", font: "secular", button: "pill", buttonFill: "glow", corners: "xl", effects: "halo" } },
  { id: "hila-day", name: "הילה — יום", design: { background: "halo-day", accent: "#d97706", font: "secular", button: "pill", buttonFill: "soft", corners: "xl", effects: "fade" } },
  { id: "minta", name: "מנטה", design: { background: "mint", accent: "#0d9488", font: "assistant", button: "rounded", buttonFill: "solid", corners: "lg", effects: "rise" } },
  { id: "grafit", name: "גרפיט", design: { background: "graphite", accent: "#f59e0b", font: "rubik", button: "sharp", buttonFill: "outline", corners: "sm", effects: "none" } },
];

export function applyTheme(t: ThemeDef): SiteDesign {
  return { theme: t.id, ...t.design };
}

// ── Plan enforcement ───────────────────────────────────────────────────────
export function asDesign(v: unknown): SiteDesign {
  const d = (v ?? {}) as Partial<SiteDesign>;
  return { ...DEFAULT_DESIGN, ...d };
}

/** Clamp a stored design to what the plan actually allows (render-time). */
export function resolveDesign(raw: unknown, plan: Plan): SiteDesign {
  const d = asDesign(raw);
  const c = caps(plan);
  const bg = background(d.background);
  const fnt = font(d.font);
  const theme = THEMES.find((t) => t.id === d.theme);
  return {
    theme: !c.allThemes && theme && !theme.free ? "or" : d.theme,
    background: !c.allBackgrounds && !bg.free ? DEFAULT_DESIGN.background : bg.id,
    accent: d.accent,
    font: !c.allFonts && !fnt.free ? DEFAULT_DESIGN.font : fnt.id,
    button: !c.allButtons && !BUTTON_SHAPES.find((b) => b.id === d.button)?.free ? "rounded" : d.button,
    buttonFill: !c.allButtons && !BUTTON_FILLS.find((f) => f.id === d.buttonFill)?.free ? "solid" : d.buttonFill,
    corners: d.corners,
    effects: !c.effects && d.effects !== "none" ? "none" : d.effects,
  };
}

// ── Resolved CSS for the renderer ──────────────────────────────────────────
export type ResolvedStyle = {
  bg: BackgroundDef;
  vars: Record<string, string>;
  dark: boolean;
};

export function designStyle(d: SiteDesign): ResolvedStyle {
  const bg = background(d.background);
  const dark = bg.mode === "dark";
  const shape = BUTTON_SHAPES.find((b) => b.id === d.button) ?? BUTTON_SHAPES[0];
  const corner = CORNERS.find((c) => c.id === d.corners) ?? CORNERS[1];
  return {
    bg,
    dark,
    vars: {
      "--site-bg": bg.css,
      "--site-accent": d.accent,
      "--site-text": dark ? "#f2f3f5" : "#1c1917",
      "--site-muted": dark ? "rgba(242,243,245,0.62)" : "rgba(28,25,23,0.6)",
      "--site-surface": dark ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.72)",
      "--site-border": dark ? "rgba(255,255,255,0.12)" : "rgba(28,25,23,0.1)",
      "--site-btn-radius": shape.radius ?? "0.9rem",
      "--site-radius": corner.radius ?? "1rem",
      "--site-font": `var(${font(d.font).variable})`,
    },
  };
}
