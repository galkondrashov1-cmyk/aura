// AURA page block schema.
// A published/draft page is a JSON document of this shape. The same schema is
// rendered by PageRenderer (public pages) and the builder canvas.
import type { ImageConfig } from "@/lib/image";
import { isSafeColor, type RichValue } from "@/lib/richtext";
import type { Typing } from "@/lib/typing";

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "x"
  | "facebook"
  | "linkedin"
  | "github"
  | "twitch"
  | "discord"
  | "telegram"
  | "whatsapp"
  | "snapchat"
  | "pinterest"
  | "reddit"
  | "spotify"
  | "soundcloud"
  | "threads"
  | "bluesky"
  | "mastodon"
  | "medium"
  | "substack"
  | "patreon"
  | "behance"
  | "dribbble"
  | "vimeo"
  | "bit"
  | "paybox"
  | "paypal"
  | "waze"
  | "googlemaps"
  | "calendly"
  | "applemusic"
  | "applepodcasts"
  | "youtubemusic"
  | "deezer"
  | "bandcamp"
  | "kick"
  | "signal"
  | "messenger"
  | "kofi"
  | "buymeacoffee"
  | "etsy"
  | "fiverr"
  | "upwork"
  | "figma"
  | "gitlab"
  | "tumblr"
  | "goodreads"
  | "letterboxd"
  | "strava"
  | "website"
  | "email"
  | "phone";

export type LinkItem = {
  label: RichValue;
  url: string;
  highlighted?: boolean;
  /** Small second line under the label. */
  sub?: string;
  /** Leading icon: an emoji, "auto" (brand icon detected from the URL) or none. */
  icon?: string;
  /** Leading thumbnail image (wins over icon). */
  thumb?: string;
  /** Per-button overrides (override the page's global button styling). */
  color?: string;
  fx?: string;
  /** Scheduling (ISO times): shown from / hidden from. */
  from?: string;
  until?: string;
};

export type AvatarShape = "circle" | "rounded" | "square";
export type DividerStyle =
  | "line" | "dashed" | "dotted" | "glow" | "double" | "wave"
  | "shimmer" | "march" | "pulse";
export type BannerHeight = "sm" | "md" | "lg";
export type Align = "left" | "center" | "right";
export type HeroLayout = "center" | "left" | "cover" | "big" | "split" | "minimal" | "masthead" | "ticket";
export type LinksLayout = "list" | "grid" | "cards";
export type Height3 = "sm" | "md" | "lg";

/** Fields every block may carry: its container and entrance animation. */
type BlockBase = {
  id: string;
  /** Container behind the block (overrides the page default). */
  box?: string;
  /** Entrance animation (overrides the page default). */
  anim?: string;
};

export type FeatureItem = { icon?: string; title: string; text?: string };
export type TestimonialItem = { quote: string; name: string; role?: string; avatar?: string; rating?: number };
export type StatItem = { value: string; label: string };
export type PriceItem = {
  name: string;
  price: string;
  period?: string;
  features?: string;
  cta?: string;
  url?: string;
  featured?: boolean;
};

/** One day of opening hours ("HH:MM"); a second range covers a midday break. */
export type DayHours = { closed?: boolean; from?: string; to?: string; from2?: string; to2?: string };

export type Block = BlockBase &
  (
    | {
        type: "hero";
        name: RichValue;
        tagline?: RichValue;
        /** Rotating words typed after the tagline ("designer", "creator"…). */
        words?: string[];
        /** How the rotating words animate (Typewriter 2.0). */
        typing?: Typing;
        /** Small status pill above the name ("Available for work"). */
        badge?: string;
        layout?: HeroLayout;
        avatarUrl?: string | null;
        avatarShape?: AvatarShape;
        avatarIdle?: string;
        /** Photo silhouette (AVATAR_SHAPES) and frame (AVATAR_FRAMES). */
        avatarMask?: string;
        avatarFrame?: string;
        /** Avatar size as a free scale (px width). Overrides preset sizes. */
        avatarScale?: number;
        avatar?: ImageConfig;
        bannerUrl?: string | null;
        bannerHeight?: BannerHeight;
        banner?: ImageConfig;
      }
    | {
        type: "links";
        items: LinkItem[];
        layout?: LinksLayout;
        /** Per-block animation overrides (win over the page-wide defaults). */
        buttonIdle?: string;
        buttonFx?: string;
      }
    | {
        type: "text";
        heading?: RichValue;
        body: RichValue;
        align?: Align;
        color?: string;
        size?: "sm" | "md" | "lg";
        spoiler?: boolean;
      }
    | {
        type: "socials";
        items: { platform: SocialPlatform; url: string }[];
        iconColor?: string;
        iconFx?: string;
        iconIdle?: string;
        /** Icon presentation: bare glyphs or filled chips. */
        iconStyle?: "plain" | "chip" | "brand";
        size?: "sm" | "md" | "lg";
      }
    | { type: "image"; url: string; alt?: string; caption?: RichValue; img?: ImageConfig }
    | {
        type: "gallery";
        images: { url: string; alt?: string }[];
        img?: ImageConfig;
        layout?: "grid" | "carousel" | "masonry";
      }
    | { type: "video"; url: string; title?: RichValue }
    | { type: "divider"; color?: string; style?: DividerStyle }
    | { type: "faq"; items: { question: RichValue; answer: RichValue }[]; align?: Align }
    // ── Landing-page blocks ──
    | {
        type: "marquee";
        text: string;
        speed?: "slow" | "normal" | "fast";
        reverse?: boolean;
        style?: "plain" | "band" | "outline" | "tilt";
      }
    | { type: "features"; heading?: string; items: FeatureItem[]; cols?: 1 | 2 | 3 }
    | { type: "testimonials"; heading?: string; items: TestimonialItem[]; layout?: "stack" | "carousel" }
    | { type: "stats"; items: StatItem[] }
    | { type: "pricing"; heading?: string; items: PriceItem[] }
    | {
        type: "form";
        kind: "newsletter" | "contact";
        heading?: string;
        text?: string;
        button?: string;
        success?: string;
      }
    | { type: "map"; query: string; height?: Height3 }
    | { type: "spacer"; size?: "sm" | "md" | "lg" | "xl" }
    /** Seven days, Sunday first (Israel time). */
    | { type: "hours"; heading?: string; days: DayHours[]; note?: string }
    /** Business card the visitor saves straight to their phone's contacts. */
    | { type: "contact"; name: string; org?: string; role?: string; phone?: string; email?: string; site?: string; address?: string }
    // ── Advanced blocks (Pro) ──
    | { type: "embed"; url: string; height?: Height3 }
    | { type: "music"; url: string }
    | { type: "countdown"; target: string; label?: string }
  );

export type BlockType = Block["type"];
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;

export type CustomBackground = {
  type: "linear" | "radial" | "conic" | "mesh";
  colors: string[];
  angle?: number;
};

export type FloatingButton = {
  kind: "whatsapp" | "phone" | "email" | "link";
  value: string;
  label?: string;
};

/** Per-page design overrides applied on top of the base (dark) theme. */
export type PageDesign = {
  accent?: string;
  background?: string;
  bgFx?: string;
  card?: string;
  buttonIdle?: string;
  buttonFx?: string;
  iconIdle?: string;
  iconFx?: string;
  /** Body font (and headings too, unless headingFont is set). */
  font?: string;
  textColor?: string;
  // Layout & shape controls (max-customization dimensions).
  buttonShape?: string;
  buttonSize?: string;
  contentWidth?: string;
  spacing?: string;
  textScale?: string;
  motionSpeed?: string;
  // Custom SEO (Pro) — override the public page's <title> / description.
  seoTitle?: string;
  seoDescription?: string;

  // ── Design studio 2.0 ──
  /** Page structure: classic stack, floating card, or desktop split. */
  layout?: string;
  headingFont?: string;
  /** Text effect on the hero name and section headings. */
  titleFx?: string;
  headingWeight?: string;
  headingCase?: string;
  headingTracking?: string;
  /** Hand-built gradient — wins over the preset background. */
  bgCustom?: CustomBackground;
  /** Photo background — wins over everything else. */
  bgImage?: string;
  bgImageDim?: number;
  bgImageBlur?: number;
  /** Slowly pan the background gradient. */
  bgAnimate?: boolean;
  /** Animated canvas/WebGL background layer. */
  liveBg?: string;
  /** Scroll-entrance animation for blocks. */
  reveal?: string;
  /** Default container behind every block. */
  section?: string;
  cursor?: string;
  dir?: "auto" | "ltr" | "rtl";
  intro?: "aura" | "fade" | "none";
  fab?: FloatingButton;
  /** Visitor accessibility menu (text size, contrast, links, motion, font). */
  a11y?: boolean;
};

export type PageContent = {
  blocks: Block[];
  design?: PageDesign;
};

export const EMPTY_PAGE: PageContent = { blocks: [] };

export const BLOCK_TYPES: BlockType[] = [
  "hero", "links", "text", "socials", "image", "gallery", "video", "divider", "faq",
  "marquee", "features", "testimonials", "stats", "pricing", "form", "map", "spacer",
  "embed", "music", "countdown", "hours", "contact",
];

const MAX_BLOCKS = 80;

const isObj = (x: unknown): x is Record<string, unknown> =>
  !!x && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown, max = 2000) => (typeof x === "string" ? x.slice(0, max) : undefined);
const num = (x: unknown, min: number, max: number) =>
  typeof x === "number" && Number.isFinite(x) ? Math.min(max, Math.max(min, x)) : undefined;
const HEX = /^#[0-9a-fA-F]{6}$/;

/** http(s) or same-origin media URL, with characters that could break a CSS url() removed. */
export function safeImageUrl(x: unknown): string | undefined {
  if (typeof x !== "string") return undefined;
  const v = x.trim();
  if (!/^(https:\/\/|http:\/\/|\/api\/media\/)/i.test(v)) return undefined;
  return v.replace(/["'()\\\s]/g, "").slice(0, 1000);
}

function sanitizeDesign(d: unknown): PageDesign | undefined {
  if (!isObj(d)) return undefined;
  const out: PageDesign = {};
  const strKeys = [
    "accent", "background", "bgFx", "card", "buttonIdle", "buttonFx", "iconIdle", "iconFx",
    "font", "textColor", "buttonShape", "buttonSize", "contentWidth", "spacing", "textScale",
    "motionSpeed", "seoTitle", "seoDescription", "layout", "headingFont", "titleFx",
    "headingWeight", "headingCase", "headingTracking", "liveBg", "reveal", "section", "cursor",
  ] as const;
  for (const k of strKeys) {
    const v = str(d[k], k.startsWith("seo") ? 300 : 120);
    if (v !== undefined) out[k] = v;
  }
  // Colors land in inline style attributes: only plain #rrggbb is allowed, so
  // a crafted value can't smuggle extra CSS declarations onto the page.
  if (out.accent && !HEX.test(out.accent)) delete out.accent;
  if (out.textColor && !HEX.test(out.textColor)) delete out.textColor;
  if (isObj(d.bgCustom)) {
    const c = d.bgCustom;
    const colors = Array.isArray(c.colors)
      ? c.colors.filter((x): x is string => typeof x === "string" && HEX.test(x)).slice(0, 4)
      : [];
    const type = ["linear", "radial", "conic", "mesh"].includes(c.type as string)
      ? (c.type as CustomBackground["type"])
      : "linear";
    if (colors.length >= 2) out.bgCustom = { type, colors, angle: num(c.angle, 0, 360) ?? 150 };
  }
  const img = safeImageUrl(d.bgImage);
  if (img) out.bgImage = img;
  const dim = num(d.bgImageDim, 0, 90);
  if (dim !== undefined) out.bgImageDim = dim;
  const blur = num(d.bgImageBlur, 0, 30);
  if (blur !== undefined) out.bgImageBlur = blur;
  if (d.bgAnimate === true) out.bgAnimate = true;
  if (d.dir === "ltr" || d.dir === "rtl" || d.dir === "auto") out.dir = d.dir;
  if (d.intro === "aura" || d.intro === "fade" || d.intro === "none") out.intro = d.intro;
  if (d.a11y === true) out.a11y = true;
  if (isObj(d.fab) && ["whatsapp", "phone", "email", "link"].includes(d.fab.kind as string)) {
    const value = str(d.fab.value, 300);
    if (value) {
      out.fab = {
        kind: d.fab.kind as FloatingButton["kind"],
        value,
        label: str(d.fab.label, 40),
      };
    }
  }
  return out;
}

/**
 * Narrow unknown JSON (Prisma Json column, or a client payload) into
 * PageContent. Unknown block types are dropped and the design is rebuilt from
 * a whitelist, so nothing unexpected ever reaches the renderer or the DB.
 */
export function asPageContent(value: unknown): PageContent {
  if (!isObj(value) || !Array.isArray(value.blocks)) return EMPTY_PAGE;
  const seen = new Set<string>();
  const blocks = value.blocks
    .filter(
      (b): b is Block =>
        isObj(b) &&
        typeof b.id === "string" &&
        BLOCK_TYPES.includes(b.type as BlockType),
    )
    .filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true)))
    .slice(0, MAX_BLOCKS)
    .map(fixBlock);
  return { blocks, design: sanitizeDesign(value.design) };
}

// List-bearing blocks must always carry an array, or one malformed save would
// crash the whole public page.
const LIST_KEY: Partial<Record<BlockType, "items" | "images">> = {
  links: "items",
  socials: "items",
  faq: "items",
  features: "items",
  testimonials: "items",
  stats: "items",
  pricing: "items",
  gallery: "images",
};

// Per-element colors are written into inline styles: drop anything that isn't
// a plain color, so a crafted save can't add CSS declarations to the page.
const COLOR_KEYS = ["color", "iconColor"] as const;
function cleanColors<T extends Record<string, unknown>>(o: T): T {
  let out = o;
  for (const k of COLOR_KEYS) {
    if (k in o && !isSafeColor(o[k] as string | undefined)) {
      out = { ...out };
      delete out[k];
    }
  }
  return out;
}

const hhmm = (x: unknown) => (typeof x === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(x) ? x : undefined);

function fixBlock(raw: Block): Block {
  const b = cleanColors(raw as unknown as Record<string, unknown>) as unknown as Block;
  if (b.type === "hours") {
    const src = Array.isArray(b.days) ? b.days : [];
    const days = Array.from({ length: 7 }, (_, i): DayHours => {
      const d: Record<string, unknown> = isObj(src[i]) ? src[i] : {};
      return { closed: d.closed === true || undefined, from: hhmm(d.from), to: hhmm(d.to), from2: hhmm(d.from2), to2: hhmm(d.to2) };
    });
    return { ...b, days };
  }
  if (b.type === "contact") {
    const f = (k: "org" | "role" | "phone" | "email" | "site" | "address") => str(b[k], 200)?.trim() || undefined;
    return { ...b, name: str(b.name, 80) ?? "", org: f("org"), role: f("role"), phone: f("phone"), email: f("email"), site: f("site"), address: f("address") };
  }
  const key = LIST_KEY[b.type];
  const rec = b as unknown as Record<string, unknown>;
  if (key && !Array.isArray(rec[key])) return { ...b, [key]: [] } as Block;
  if (key) {
    const list = (rec[key] as unknown[]).filter(isObj).slice(0, 60).map(cleanColors);
    return { ...b, [key]: list } as Block;
  }
  return b;
}

/** First hero block, if any. */
export function heroOf(content: PageContent): BlockOf<"hero"> | undefined {
  return content.blocks.find((b): b is BlockOf<"hero"> => b.type === "hero");
}
