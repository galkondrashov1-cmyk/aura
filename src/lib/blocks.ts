// AURA page block schema.
// A published/draft page is a JSON document of this shape. The same schema is
// rendered by PublicPageRenderer (public pages) and the builder canvas.
import type { ImageConfig } from "@/lib/image";
import type { RichValue } from "@/lib/richtext";

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
  | "website"
  | "email"
  | "phone";

export type LinkItem = {
  label: RichValue;
  url: string;
  highlighted?: boolean;
  /** Per-button overrides (override the page's global button styling). */
  color?: string;
  fx?: string;
};

export type AvatarShape = "circle" | "rounded" | "square";
export type DividerStyle =
  | "line" | "dashed" | "dotted" | "glow" | "double" | "wave"
  | "shimmer" | "march" | "pulse";
export type BannerHeight = "sm" | "md" | "lg";

export type Block =
  | {
      id: string;
      type: "hero";
      name: RichValue;
      tagline?: RichValue;
      avatarUrl?: string | null;
      avatarShape?: AvatarShape;
      avatarIdle?: string;
      /** Avatar size as a free scale (px width). Overrides preset sizes. */
      avatarScale?: number;
      avatar?: ImageConfig;
      bannerUrl?: string | null;
      bannerHeight?: BannerHeight;
      banner?: ImageConfig;
    }
  | {
      id: string;
      type: "links";
      items: LinkItem[];
      /** Per-block animation overrides (win over the page-wide defaults). */
      buttonIdle?: string;
      buttonFx?: string;
    }
  | {
      id: string;
      type: "text";
      heading?: RichValue;
      body: RichValue;
      align?: "left" | "center" | "right";
      color?: string;
      size?: "sm" | "md" | "lg";
      spoiler?: boolean;
    }
  | {
      id: string;
      type: "socials";
      items: { platform: SocialPlatform; url: string }[];
      iconColor?: string;
      iconFx?: string;
      iconIdle?: string;
    }
  | { id: string; type: "image"; url: string; alt?: string; caption?: RichValue; img?: ImageConfig }
  | {
      id: string;
      type: "gallery";
      images: { url: string; alt?: string }[];
      img?: ImageConfig;
      layout?: "grid" | "carousel";
    }
  | { id: string; type: "video"; url: string; title?: RichValue }
  | {
      id: string;
      type: "divider";
      color?: string;
      style?: DividerStyle;
    }
  | {
      id: string;
      type: "faq";
      items: { question: RichValue; answer: RichValue }[];
      align?: "left" | "center" | "right";
    }
  // ── Advanced blocks (Pro) ──
  | { id: string; type: "embed"; url: string; height?: "sm" | "md" | "lg" }
  | { id: string; type: "music"; url: string }
  | { id: string; type: "countdown"; target: string; label?: string };

export type BlockType = Block["type"];

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
};

export type PageContent = {
  blocks: Block[];
  design?: PageDesign;
};

export const EMPTY_PAGE: PageContent = { blocks: [] };

/** Narrow unknown JSON (Prisma Json column) into PageContent with a safe fallback. */
export function asPageContent(value: unknown): PageContent {
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as PageContent).blocks)
  ) {
    const v = value as PageContent;
    const str = (x: unknown) => (typeof x === "string" ? x : undefined);
    const design =
      v.design && typeof v.design === "object"
        ? {
            accent: str(v.design.accent),
            background: str(v.design.background),
            bgFx: str(v.design.bgFx),
            card: str(v.design.card),
            buttonIdle: str(v.design.buttonIdle),
            buttonFx: str(v.design.buttonFx),
            iconIdle: str(v.design.iconIdle),
            iconFx: str(v.design.iconFx),
            font: str(v.design.font),
            textColor: str(v.design.textColor),
            buttonShape: str(v.design.buttonShape),
            buttonSize: str(v.design.buttonSize),
            contentWidth: str(v.design.contentWidth),
            spacing: str(v.design.spacing),
            textScale: str(v.design.textScale),
            motionSpeed: str(v.design.motionSpeed),
            seoTitle: str(v.design.seoTitle),
            seoDescription: str(v.design.seoDescription),
          }
        : undefined;
    return {
      blocks: v.blocks,
      design,
    };
  }
  return EMPTY_PAGE;
}
