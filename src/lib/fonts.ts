// Curated set of free Google fonts a creator can pick for their page —
// Latin families plus a Hebrew set (all with Latin glyphs too) for RTL pages. Each is loaded via next/font (self-hosted, no layout shift) and
// exposed as a CSS variable. We declare all of them but `preload: false` means
// the browser only downloads the font file that is actually used on a page.
import {
  Inter,
  Poppins,
  Montserrat,
  DM_Sans,
  Sora,
  Space_Grotesk,
  Playfair_Display,
  Lora,
  Merriweather,
  Oswald,
  Bebas_Neue,
  Archivo,
  Nunito,
  Caveat,
  Manrope,
  Outfit,
  Epilogue,
  Fraunces,
  Crimson_Pro,
  Syne,
  JetBrains_Mono,
  Pacifico,
  Unbounded,
  Instrument_Serif,
  Bricolage_Grotesque,
  Space_Mono,
  Dancing_Script,
  Abril_Fatface,
  Righteous,
  Monoton,
  Press_Start_2P,
  Permanent_Marker,
  DM_Serif_Display,
  Heebo,
  Rubik,
  Assistant,
  Secular_One,
  Frank_Ruhl_Libre,
  Varela_Round,
  Suez_One,
  Amatic_SC,
  Karantina,
  Fredoka,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-inter", weight: ["400", "600", "700"] });
const poppins = Poppins({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-poppins", weight: ["400", "600", "700"] });
const montserrat = Montserrat({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-montserrat", weight: ["400", "600", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-dmsans", weight: ["400", "500", "700"] });
const sora = Sora({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-sora", weight: ["400", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-grotesk", weight: ["400", "500", "700"] });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-playfair", weight: ["400", "600", "700"] });
const lora = Lora({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-lora", weight: ["400", "600", "700"] });
const merriweather = Merriweather({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-merriweather", weight: ["400", "700"] });
const oswald = Oswald({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-oswald", weight: ["400", "600", "700"] });
const bebas = Bebas_Neue({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-bebas", weight: ["400"] });
const archivo = Archivo({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-archivo", weight: ["400", "600", "700"] });
const nunito = Nunito({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-nunito", weight: ["400", "600", "700"] });
const caveat = Caveat({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-caveat", weight: ["400", "700"] });
const manrope = Manrope({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-manrope", weight: ["400", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-outfit", weight: ["400", "600", "700"] });
const epilogue = Epilogue({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-epilogue", weight: ["400", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-fraunces", weight: ["400", "600", "700"] });
const crimson = Crimson_Pro({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-crimson", weight: ["400", "600", "700"] });
const syne = Syne({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-syne", weight: ["400", "600", "700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-jetbrains", weight: ["400", "600", "700"] });
const pacifico = Pacifico({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-pacifico", weight: ["400"] });
const unbounded = Unbounded({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-unbounded", weight: ["400", "600", "800"] });
const instrument = Instrument_Serif({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-instrument", weight: ["400"], style: ["normal", "italic"] });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-bricolage", weight: ["400", "600", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-spacemono", weight: ["400", "700"] });
const dancing = Dancing_Script({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-dancing", weight: ["400", "700"] });
const abril = Abril_Fatface({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-abril", weight: ["400"] });
const righteous = Righteous({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-righteous", weight: ["400"] });
const monoton = Monoton({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-monoton", weight: ["400"] });
const pressStart = Press_Start_2P({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-pixel", weight: ["400"] });
const marker = Permanent_Marker({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-marker", weight: ["400"] });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-p-dmserif", weight: ["400"] });
// Hebrew families (Hebrew + Latin glyphs).
const heebo = Heebo({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-heebo", weight: ["400", "600", "800"] });
const rubik = Rubik({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-rubik", weight: ["400", "600", "800"] });
const assistant = Assistant({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-assistant", weight: ["400", "600", "800"] });
const secular = Secular_One({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-secular", weight: ["400"] });
const frankRuhl = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-frankruhl", weight: ["400", "700"] });
const varela = Varela_Round({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-varela", weight: ["400"] });
const suez = Suez_One({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-suez", weight: ["400"] });
const amatic = Amatic_SC({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-amatic", weight: ["400", "700"] });
const karantina = Karantina({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-karantina", weight: ["400", "700"] });
const fredoka = Fredoka({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-p-fredoka", weight: ["400", "600"] });

export type FontDef = { id: string; name: string; variable: string; category: string };

export const FONTS: FontDef[] = [
  { id: "inter", name: "Inter", variable: "--font-p-inter", category: "Sans" },
  { id: "poppins", name: "Poppins", variable: "--font-p-poppins", category: "Sans" },
  { id: "montserrat", name: "Montserrat", variable: "--font-p-montserrat", category: "Sans" },
  { id: "dmsans", name: "DM Sans", variable: "--font-p-dmsans", category: "Sans" },
  { id: "sora", name: "Sora", variable: "--font-p-sora", category: "Sans" },
  { id: "grotesk", name: "Space Grotesk", variable: "--font-p-grotesk", category: "Sans" },
  { id: "archivo", name: "Archivo", variable: "--font-p-archivo", category: "Sans" },
  { id: "nunito", name: "Nunito", variable: "--font-p-nunito", category: "Sans" },
  { id: "playfair", name: "Playfair Display", variable: "--font-p-playfair", category: "Serif" },
  { id: "lora", name: "Lora", variable: "--font-p-lora", category: "Serif" },
  { id: "merriweather", name: "Merriweather", variable: "--font-p-merriweather", category: "Serif" },
  { id: "oswald", name: "Oswald", variable: "--font-p-oswald", category: "Display" },
  { id: "bebas", name: "Bebas Neue", variable: "--font-p-bebas", category: "Display" },
  { id: "caveat", name: "Caveat", variable: "--font-p-caveat", category: "Handwriting" },
  { id: "manrope", name: "Manrope", variable: "--font-p-manrope", category: "Sans" },
  { id: "outfit", name: "Outfit", variable: "--font-p-outfit", category: "Sans" },
  { id: "epilogue", name: "Epilogue", variable: "--font-p-epilogue", category: "Sans" },
  { id: "fraunces", name: "Fraunces", variable: "--font-p-fraunces", category: "Serif" },
  { id: "crimson", name: "Crimson Pro", variable: "--font-p-crimson", category: "Serif" },
  { id: "syne", name: "Syne", variable: "--font-p-syne", category: "Display" },
  { id: "jetbrains", name: "JetBrains Mono", variable: "--font-p-jetbrains", category: "Mono" },
  { id: "pacifico", name: "Pacifico", variable: "--font-p-pacifico", category: "Handwriting" },
  { id: "bricolage", name: "Bricolage", variable: "--font-p-bricolage", category: "Sans" },
  { id: "instrument", name: "Instrument Serif", variable: "--font-p-instrument", category: "Serif" },
  { id: "dmserif", name: "DM Serif", variable: "--font-p-dmserif", category: "Serif" },
  { id: "unbounded", name: "Unbounded", variable: "--font-p-unbounded", category: "Display" },
  { id: "abril", name: "Abril Fatface", variable: "--font-p-abril", category: "Display" },
  { id: "righteous", name: "Righteous", variable: "--font-p-righteous", category: "Display" },
  { id: "monoton", name: "Monoton", variable: "--font-p-monoton", category: "Display" },
  { id: "pixel", name: "Pixel 2P", variable: "--font-p-pixel", category: "Display" },
  { id: "spacemono", name: "Space Mono", variable: "--font-p-spacemono", category: "Mono" },
  { id: "dancing", name: "Dancing Script", variable: "--font-p-dancing", category: "Handwriting" },
  { id: "marker", name: "Marker", variable: "--font-p-marker", category: "Handwriting" },
  { id: "heebo", name: "Heebo", variable: "--font-p-heebo", category: "Hebrew" },
  { id: "rubik", name: "Rubik", variable: "--font-p-rubik", category: "Hebrew" },
  { id: "assistant", name: "Assistant", variable: "--font-p-assistant", category: "Hebrew" },
  { id: "varela", name: "Varela Round", variable: "--font-p-varela", category: "Hebrew" },
  { id: "fredoka", name: "Fredoka", variable: "--font-p-fredoka", category: "Hebrew" },
  { id: "secular", name: "Secular One", variable: "--font-p-secular", category: "Hebrew" },
  { id: "suez", name: "Suez One", variable: "--font-p-suez", category: "Hebrew" },
  { id: "frankruhl", name: "Frank Ruhl", variable: "--font-p-frankruhl", category: "Hebrew" },
  { id: "karantina", name: "Karantina", variable: "--font-p-karantina", category: "Hebrew" },
  { id: "amatic", name: "Amatic SC", variable: "--font-p-amatic", category: "Hebrew" },
];

/** Display order of font categories in the picker. */
export const FONT_CATEGORIES = ["Sans", "Hebrew", "Serif", "Display", "Handwriting", "Mono"];

/** Space-separated next/font variable classNames — attach once to <body>. */
export const fontVars = [
  inter,
  poppins,
  montserrat,
  dmSans,
  sora,
  spaceGrotesk,
  playfair,
  lora,
  merriweather,
  oswald,
  bebas,
  archivo,
  nunito,
  caveat,
  manrope,
  outfit,
  epilogue,
  fraunces,
  crimson,
  syne,
  jetbrains,
  pacifico,
  unbounded,
  instrument,
  bricolage,
  spaceMono,
  dancing,
  abril,
  righteous,
  monoton,
  pressStart,
  marker,
  dmSerif,
  heebo,
  rubik,
  assistant,
  secular,
  frankRuhl,
  varela,
  suez,
  amatic,
  karantina,
  fredoka,
]
  .map((f) => f.variable)
  .join(" ");

/** `var(--font-…)` reference for a chosen font id, or undefined for default. */
export function fontFamilyVar(id?: string): string | undefined {
  const f = id ? FONTS.find((x) => x.id === id) : undefined;
  return f ? `var(${f.variable})` : undefined;
}
