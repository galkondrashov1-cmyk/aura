// Curated Google fonts a creator can pick for their page — Latin families
// plus a Hebrew set (all with Latin glyphs too) for RTL pages.
//
// These are NOT next/font instances on purpose: 43 self-hosted families put
// ~430 @font-face rules (≈140 KB of render-blocking CSS) on every page and
// made every build download ~180 font files. Instead a page links one small
// Google Fonts stylesheet for just the fonts it uses (see PageRenderer), and
// only the editor loads the whole set for its previews. The site's own UI
// fonts (Inter, Plus Jakarta Sans) stay on next/font in the root layout.

export type FontDef = {
  id: string;
  name: string;
  /** Google Fonts family name. */
  family: string;
  /** Weights that exist for this family (validated against Google's data). */
  weights: number[];
  category: string;
};

const F = (id: string, name: string, family: string, weights: number[], category: string): FontDef => ({
  id,
  name,
  family,
  weights,
  category,
});

export const FONTS: FontDef[] = [
  F("inter", "Inter", "Inter", [400, 600, 700], "Sans"),
  F("poppins", "Poppins", "Poppins", [400, 600, 700], "Sans"),
  F("montserrat", "Montserrat", "Montserrat", [400, 600, 700], "Sans"),
  F("dmsans", "DM Sans", "DM Sans", [400, 500, 700], "Sans"),
  F("sora", "Sora", "Sora", [400, 600, 700], "Sans"),
  F("grotesk", "Space Grotesk", "Space Grotesk", [400, 500, 700], "Sans"),
  F("archivo", "Archivo", "Archivo", [400, 600, 700], "Sans"),
  F("nunito", "Nunito", "Nunito", [400, 600, 700], "Sans"),
  F("playfair", "Playfair Display", "Playfair Display", [400, 600, 700], "Serif"),
  F("lora", "Lora", "Lora", [400, 600, 700], "Serif"),
  F("merriweather", "Merriweather", "Merriweather", [400, 700], "Serif"),
  F("oswald", "Oswald", "Oswald", [400, 600, 700], "Display"),
  F("bebas", "Bebas Neue", "Bebas Neue", [400], "Display"),
  F("caveat", "Caveat", "Caveat", [400, 700], "Handwriting"),
  F("manrope", "Manrope", "Manrope", [400, 600, 700], "Sans"),
  F("outfit", "Outfit", "Outfit", [400, 600, 700], "Sans"),
  F("epilogue", "Epilogue", "Epilogue", [400, 600, 700], "Sans"),
  F("fraunces", "Fraunces", "Fraunces", [400, 600, 700], "Serif"),
  F("crimson", "Crimson Pro", "Crimson Pro", [400, 600, 700], "Serif"),
  F("syne", "Syne", "Syne", [400, 600, 700], "Display"),
  F("jetbrains", "JetBrains Mono", "JetBrains Mono", [400, 600, 700], "Mono"),
  F("pacifico", "Pacifico", "Pacifico", [400], "Handwriting"),
  F("bricolage", "Bricolage", "Bricolage Grotesque", [400, 600, 800], "Sans"),
  F("instrument", "Instrument Serif", "Instrument Serif", [400], "Serif"),
  F("dmserif", "DM Serif", "DM Serif Display", [400], "Serif"),
  F("unbounded", "Unbounded", "Unbounded", [400, 600, 800], "Display"),
  F("abril", "Abril Fatface", "Abril Fatface", [400], "Display"),
  F("righteous", "Righteous", "Righteous", [400], "Display"),
  F("monoton", "Monoton", "Monoton", [400], "Display"),
  F("pixel", "Pixel 2P", "Press Start 2P", [400], "Display"),
  F("spacemono", "Space Mono", "Space Mono", [400, 700], "Mono"),
  F("dancing", "Dancing Script", "Dancing Script", [400, 700], "Handwriting"),
  F("marker", "Marker", "Permanent Marker", [400], "Handwriting"),
  F("heebo", "Heebo", "Heebo", [400, 600, 800], "Hebrew"),
  F("rubik", "Rubik", "Rubik", [400, 600, 800], "Hebrew"),
  F("assistant", "Assistant", "Assistant", [400, 600, 800], "Hebrew"),
  F("varela", "Varela Round", "Varela Round", [400], "Hebrew"),
  F("fredoka", "Fredoka", "Fredoka", [400, 600], "Hebrew"),
  F("secular", "Secular One", "Secular One", [400], "Hebrew"),
  F("suez", "Suez One", "Suez One", [400], "Hebrew"),
  F("frankruhl", "Frank Ruhl", "Frank Ruhl Libre", [400, 700], "Hebrew"),
  F("karantina", "Karantina", "Karantina", [400, 700], "Hebrew"),
  F("amatic", "Amatic SC", "Amatic SC", [400, 700], "Hebrew"),
];

/** Display order of font categories in the picker. */
export const FONT_CATEGORIES = ["Sans", "Hebrew", "Serif", "Display", "Handwriting", "Mono"];

const FALLBACK: Record<string, string> = {
  Serif: "ui-serif, Georgia, serif",
  Mono: "ui-monospace, monospace",
  Handwriting: "cursive",
};

/** CSS font-family value for a chosen font id, or undefined for the default. */
export function fontFamilyVar(id?: string): string | undefined {
  const f = id ? FONTS.find((x) => x.id === id) : undefined;
  return f ? `'${f.family}', ${FALLBACK[f.category] ?? "ui-sans-serif, system-ui, sans-serif"}` : undefined;
}

function familyParam(f: FontDef): string {
  const name = f.family.replace(/ /g, "+");
  return f.weights.length === 1 && f.weights[0] === 400 ? name : `${name}:wght@${f.weights.join(";")}`;
}

/** One Google Fonts stylesheet URL for the given font ids (null if none). */
export function fontsHref(ids: (string | undefined)[]): string | null {
  const defs = [...new Set(ids)].map((id) => FONTS.find((f) => f.id === id)).filter((f): f is FontDef => !!f);
  if (defs.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${defs.map((f) => `family=${familyParam(f)}`).join("&")}&display=swap`;
}

/** Every font — for the editor's pickers and previews only. */
export const ALL_FONTS_HREF = fontsHref(FONTS.map((f) => f.id))!;
