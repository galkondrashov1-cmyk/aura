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
};

export type AvatarShape = "circle" | "rounded" | "square";
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
      avatar?: ImageConfig;
      bannerUrl?: string | null;
      bannerHeight?: BannerHeight;
      banner?: ImageConfig;
    }
  | { id: string; type: "links"; items: LinkItem[] }
  | { id: string; type: "text"; heading?: RichValue; body: RichValue }
  | { id: string; type: "socials"; items: { platform: SocialPlatform; url: string }[] }
  | { id: string; type: "image"; url: string; alt?: string; caption?: RichValue; img?: ImageConfig }
  | { id: string; type: "gallery"; images: { url: string; alt?: string }[]; img?: ImageConfig }
  | { id: string; type: "video"; url: string; title?: RichValue }
  | { id: string; type: "divider" }
  | { id: string; type: "faq"; items: { question: RichValue; answer: RichValue }[] }
  | {
      id: string;
      type: "products";
      items: {
        title: RichValue;
        description?: RichValue;
        price?: string;
        imageUrl?: string;
        ctaLabel?: string;
        ctaUrl?: string;
      }[];
    }
  | { id: string; type: "form"; heading?: RichValue; buttonLabel?: string };

export type BlockType = Block["type"];

export type PageTheme = "vivid" | "muted";

/** Per-page design overrides (applied on top of the chosen theme). */
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
};

export type PageContent = {
  theme: PageTheme;
  blocks: Block[];
  design?: PageDesign;
};

export const EMPTY_PAGE: PageContent = { theme: "vivid", blocks: [] };

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
          }
        : undefined;
    return {
      theme: v.theme === "muted" ? "muted" : "vivid",
      blocks: v.blocks,
      design,
    };
  }
  return EMPTY_PAGE;
}
