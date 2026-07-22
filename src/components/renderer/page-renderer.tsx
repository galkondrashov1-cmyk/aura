import Link from "next/link";
import { AuraMark } from "@/components/aura-logo";
import { ViewBeacon } from "@/components/view-beacon";
import { GalleryView } from "./gallery-view";
import { CountdownView } from "./countdown-view";
import { CursorFx } from "./cursor-fx";
import { cn } from "@/lib/utils";
import type {
  Block,
  PageContent,
  SocialPlatform,
  AvatarShape,
  BannerHeight,
} from "@/lib/blocks";
import {
  resolveDesign,
  resolveLayout,
  LIGHT_VARS,
  INTERACTIVE_BG_FX,
  secondaryAccent,
  avatarIdleClass,
  buttonFxClass,
  buttonIdleClass,
  iconFxClass,
  iconIdleClass,
} from "@/lib/design";
import { resolveImage } from "@/lib/image";
import type { ImageConfig, ImageSize, ImageRadius } from "@/lib/image";
import { fontFamilyVar } from "@/lib/fonts";
import { SocialIcon, normalizeSocialUrl } from "@/lib/socials";
import { RichTextView } from "@/components/rich-text-view";
import { toPlain, isEmptyRich } from "@/lib/richtext";
import type { RichValue } from "@/lib/richtext";

type DesignClasses = {
  card?: string;
  buttonFx?: string;
  buttonIdle?: string;
  iconFx?: string;
  iconIdle?: string;
  buttonShape?: string;
  buttonSize?: string;
};

function trackedHref(pageId: string | undefined, url: string, label?: string) {
  if (!pageId) return url;
  const q = new URLSearchParams({ p: pageId, u: url });
  if (label) q.set("l", label);
  return `/api/r?${q.toString()}`;
}

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m ? m[1] : null;
}

const AVATAR_W: Record<ImageSize, string> = {
  sm: "w-16",
  md: "w-20",
  lg: "w-28",
  full: "w-36",
};
const BANNER_H: Record<BannerHeight, string> = {
  sm: "h-24",
  md: "h-36",
  lg: "h-48",
};
// Legacy avatar "shape" maps onto the unified radius control.
const SHAPE_RADIUS: Record<AvatarShape, ImageRadius> = {
  circle: "full",
  rounded: "lg",
  square: "sm",
};

function HeroBlock({
  name,
  tagline,
  avatarUrl,
  avatarShape,
  avatarIdle,
  avatarScale,
  avatar,
  bannerUrl,
  bannerHeight,
  banner,
}: {
  name: RichValue;
  tagline?: RichValue;
  avatarUrl?: string | null;
  avatarShape?: AvatarShape;
  avatarIdle?: string;
  avatarScale?: number;
  avatar?: ImageConfig;
  bannerUrl?: string | null;
  bannerHeight?: BannerHeight;
  banner?: ImageConfig;
}) {
  const idle = avatarIdleClass(avatarIdle);
  const avatarCfg: ImageConfig =
    avatar ?? { radius: avatarShape ? SHAPE_RADIUS[avatarShape] : "full" };
  const av = resolveImage(avatarCfg, {
    lockWidth: AVATAR_W[avatarCfg.size ?? "md"],
    defaultAspect: "square",
    defaultRadius: "full",
  });
  const scaleStyle = avatarScale
    ? ({ width: `${Math.min(Math.max(avatarScale, 48), 200)}px` } as React.CSSProperties)
    : undefined;
  const avatarEl = (
    <span className={cn("inline-flex", idle)}>
      <span className={cn("block border-2 border-bg", av.box)} style={scaleStyle}>
        <div className={av.frame}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={toPlain(name)} className={av.img} />
          ) : (
            <span className="grid h-full w-full place-items-center bg-surface-2 text-primary">
              <AuraMark className="h-9 w-9" />
            </span>
          )}
        </div>
      </span>
    </span>
  );

  let bannerEl: React.ReactNode = null;
  if (bannerUrl) {
    const useLegacy = !banner && !!bannerHeight;
    const bn = resolveImage(banner, {
      lockWidth: "w-full",
      defaultAspect: useLegacy ? "auto" : "wide",
      defaultRadius: "lg",
    });
    bannerEl = (
      <div className="-mx-5 mb-3 w-[calc(100%+2.5rem)]">
        <div className={cn(bn.box, useLegacy && bannerHeight && BANNER_H[bannerHeight])}>
          <div className={cn(bn.frame, useLegacy && "h-full")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerUrl}
              alt=""
              className={useLegacy ? "h-full w-full object-cover" : bn.img}
            />
          </div>
        </div>
        <div className="-mt-10 flex justify-center">{avatarEl}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      {bannerEl ?? <div className="mb-4">{avatarEl}</div>}
      <h1 className="font-display text-2xl font-medium tracking-tight">
        <RichTextView value={name} />
      </h1>
      {!isEmptyRich(tagline) && (
        <p className="mt-1 text-sm text-text-muted">
          <RichTextView value={tagline} />
        </p>
      )}
    </div>
  );
}

function LinksBlock({
  items,
  pageId,
  cardClass,
  buttonFx,
  buttonIdle,
  buttonShape,
  buttonSize,
}: {
  items: {
    label: RichValue;
    url: string;
    highlighted?: boolean;
    color?: string;
    fx?: string;
  }[];
  pageId?: string;
  cardClass?: string;
  buttonFx?: string;
  buttonIdle?: string;
  buttonShape?: string;
  buttonSize?: string;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((l, i) => {
        // Per-button color: solid fill for highlighted buttons, tinted
        // border/text for the rest. Per-button effect overrides the global one.
        const fx = buttonFxClass(l.fx) ?? buttonFx;
        const style = l.color
          ? l.highlighted
            ? { background: l.color, color: "#fff", borderColor: l.color }
            : { borderColor: l.color, color: l.color }
          : undefined;
        return (
          <div key={i} className={buttonIdle}>
            <a
              href={trackedHref(pageId, l.url, toPlain(l.label))}
              target="_blank"
              rel="noopener noreferrer"
              style={style}
              className={cn(
                "flex items-center justify-center font-medium",
                buttonShape ?? "rounded-full",
                buttonSize ?? "h-12 text-sm",
                l.color
                  ? "border"
                  : l.highlighted
                    ? "aura-glow bg-primary text-primary-ink"
                    : (cardClass ?? "border border-border bg-surface-2 text-text"),
                fx ?? "transition-all duration-150 hover:brightness-110",
              )}
            >
              <RichTextView value={l.label} />
            </a>
          </div>
        );
      })}
    </div>
  );
}

function TextBlock({
  heading,
  body,
  align = "left",
  color,
  size = "md",
  spoiler,
}: {
  heading?: RichValue;
  body: RichValue;
  align?: "left" | "center" | "right";
  color?: string;
  size?: "sm" | "md" | "lg";
  spoiler?: boolean;
}) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  const headSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";
  const bodySize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";
  const bodyEl = (
    <p
      className={cn("leading-relaxed", bodySize, color ? "" : "text-text-muted")}
      style={color ? { color } : undefined}
    >
      <RichTextView value={body} />
    </p>
  );
  return (
    <div className={alignClass} style={color ? { color } : undefined}>
      {!isEmptyRich(heading) && (
        <h2 className={cn("font-display mb-2 font-medium tracking-tight", headSize)}>
          <RichTextView value={heading} />
        </h2>
      )}
      {spoiler ? (
        <details className="group rounded-xl border border-border bg-surface/40 px-4 py-2.5">
          <summary className="cursor-pointer list-none text-sm font-medium text-text select-none">
            <span className="text-primary">▸</span> Spoiler — tap to reveal
          </summary>
          <div className="mt-2">{bodyEl}</div>
        </details>
      ) : (
        bodyEl
      )}
    </div>
  );
}

function SocialsBlock({
  items,
  pageId,
  iconFx,
  iconIdle,
  iconColor,
}: {
  items: { platform: SocialPlatform; url: string }[];
  pageId?: string;
  iconFx?: string;
  iconIdle?: string;
  iconColor?: string;
}) {
  return (
    <div
      className="flex flex-wrap justify-center gap-5 text-text-muted"
      style={iconColor ? { color: iconColor } : undefined}
    >
      {items.map((s, i) => {
        const href = normalizeSocialUrl(s.platform, s.url);
        // mailto:/tel: links can't be routed through the click-tracking redirect.
        const isWeb = /^https?:/i.test(href);
        return (
          <a
            key={i}
            href={isWeb ? trackedHref(pageId, href) : href}
            target={isWeb ? "_blank" : undefined}
            rel={isWeb ? "noopener noreferrer" : undefined}
            aria-label={s.platform}
            className={cn("inline-flex", iconFx ?? "transition-colors hover:text-text")}
          >
            <span className={cn("inline-flex", iconIdle)}>
              <SocialIcon platform={s.platform} className="h-5 w-5" />
            </span>
          </a>
        );
      })}
    </div>
  );
}

function VideoBlock({ url, title }: { url: string; title?: RichValue }) {
  const id = youtubeId(url);
  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 items-center justify-center rounded-full border border-border bg-surface-2 text-sm font-medium text-text"
      >
        {isEmptyRich(title) ? "Watch video" : <RichTextView value={title} />}
      </a>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={toPlain(title) || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

function ImageBlock({
  url,
  alt,
  caption,
  img,
}: {
  url: string;
  alt?: string;
  caption?: RichValue;
  img?: ImageConfig;
}) {
  if (!url) return null;
  const r = resolveImage(img, { defaultSize: "full", defaultAspect: "auto", defaultRadius: "md" });
  return (
    <figure className={cn("mx-auto border border-border", r.box)}>
      <div className={r.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt ?? ""} className={r.img} />
      </div>
      {!isEmptyRich(caption) && (
        <figcaption className="bg-surface px-4 py-2 text-xs text-text-muted">
          <RichTextView value={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function GalleryBlock({
  images,
  img,
  layout,
}: {
  images: { url: string; alt?: string }[];
  img?: ImageConfig;
  layout?: "grid" | "carousel";
}) {
  const valid = images.filter((i) => i.url);
  if (valid.length === 0) return null;
  const aspect = layout === "carousel" ? "wide" : "square";
  const r = resolveImage(img, { lockWidth: "w-full", defaultAspect: aspect, defaultRadius: "sm" });
  return <GalleryView images={valid} layout={layout} box={r.box} frame={r.frame} img={r.img} />;
}

function FaqBlock({
  items,
  align = "left",
}: {
  items: { question: RichValue; answer: RichValue }[];
  align?: "left" | "center" | "right";
}) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
  return (
    <div className={cn("divide-y divide-border overflow-hidden rounded-2xl border border-border", alignClass)}>
      {items.map((f, i) => (
        <details key={i} className="group px-4 py-3">
          <summary className="cursor-pointer list-none text-sm font-medium">
            <RichTextView value={f.question} />
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            <RichTextView value={f.answer} />
          </p>
        </details>
      ))}
    </div>
  );
}

const EMBED_H: Record<"sm" | "md" | "lg", string> = {
  sm: "h-60",
  md: "h-80",
  lg: "h-[480px]",
};

function EmbedBlock({ url, height = "md" }: { url: string; height?: "sm" | "md" | "lg" }) {
  if (!/^https:\/\//i.test(url)) {
    return <p className="text-center text-sm text-text-muted">Add an https:// URL to embed…</p>;
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <iframe
        src={url}
        title="Embedded content"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms"
        className={cn("w-full", EMBED_H[height])}
      />
    </div>
  );
}

/** Turn a share URL from Spotify / SoundCloud / Apple Music into its embed player. */
function musicEmbed(url: string): { src: string; height: number } | null {
  try {
    const u = new URL(url);
    if (u.hostname === "open.spotify.com") {
      const m = u.pathname.match(/^\/(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/);
      if (m) {
        return {
          src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`,
          height: m[1] === "track" || m[1] === "episode" ? 152 : 352,
        };
      }
    }
    if (u.hostname.endsWith("soundcloud.com")) {
      return {
        src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%2300e5a0&inverse=true`,
        height: 166,
      };
    }
    if (u.hostname === "music.apple.com") {
      return { src: `https://embed.music.apple.com${u.pathname}`, height: 175 };
    }
  } catch {
    /* fall through */
  }
  return null;
}

function MusicBlock({ url }: { url: string }) {
  const embed = musicEmbed(url);
  if (!embed) {
    return (
      <p className="text-center text-sm text-text-muted">
        Paste a Spotify, SoundCloud or Apple Music link…
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-2xl">
      <iframe
        src={embed.src}
        title="Music player"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-popups"
        style={{ height: embed.height }}
        className="w-full"
      />
    </div>
  );
}

function DividerBlock({
  color,
  style = "line",
}: {
  color?: string;
  style?: import("@/lib/blocks").DividerStyle;
}) {
  // Default look stays the signature fading hairline.
  if (!color && style === "line") return <div className="aura-rule" />;
  return (
    <div
      className={cn("dv", `dv-${style}`)}
      style={color ? ({ "--dvc": color } as React.CSSProperties) : undefined}
    />
  );
}

function BlockRenderer({
  block,
  pageId,
  d,
}: {
  block: Block;
  pageId?: string;
  d: DesignClasses;
}) {
  switch (block.type) {
    case "hero":
      return (
        <HeroBlock
          name={block.name}
          tagline={block.tagline}
          avatarUrl={block.avatarUrl}
          avatarShape={block.avatarShape}
          avatarIdle={block.avatarIdle}
          avatarScale={block.avatarScale}
          avatar={block.avatar}
          bannerUrl={block.bannerUrl}
          bannerHeight={block.bannerHeight}
          banner={block.banner}
        />
      );
    case "links":
      return (
        <LinksBlock
          items={block.items}
          pageId={pageId}
          cardClass={d.card}
          buttonFx={buttonFxClass(block.buttonFx) ?? d.buttonFx}
          buttonIdle={buttonIdleClass(block.buttonIdle) ?? d.buttonIdle}
          buttonShape={d.buttonShape}
          buttonSize={d.buttonSize}
        />
      );
    case "text":
      return (
        <TextBlock
          heading={block.heading}
          body={block.body}
          align={block.align}
          color={block.color}
          size={block.size}
          spoiler={block.spoiler}
        />
      );
    case "socials":
      return (
        <SocialsBlock
          items={block.items}
          pageId={pageId}
          iconFx={iconFxClass(block.iconFx) ?? d.iconFx}
          iconIdle={iconIdleClass(block.iconIdle) ?? d.iconIdle}
          iconColor={block.iconColor}
        />
      );
    case "video":
      return <VideoBlock url={block.url} title={block.title} />;
    case "image":
      return (
        <ImageBlock url={block.url} alt={block.alt} caption={block.caption} img={block.img} />
      );
    case "gallery":
      return <GalleryBlock images={block.images} img={block.img} layout={block.layout} />;
    case "faq":
      return <FaqBlock items={block.items} align={block.align} />;
    case "divider":
      return <DividerBlock color={block.color} style={block.style} />;
    case "embed":
      return <EmbedBlock url={block.url} height={block.height} />;
    case "music":
      return <MusicBlock url={block.url} />;
    case "countdown":
      return <CountdownView target={block.target} label={block.label} />;
    default:
      return null;
  }
}

export function PageRenderer({
  content,
  embedded = false,
  trackPageId,
  hideBadge = false,
}: {
  content: PageContent;
  embedded?: boolean;
  trackPageId?: string;
  hideBadge?: boolean;
}) {
  const r = resolveDesign(content.design);
  const layout = resolveLayout(content.design);
  const style: Record<string, string> = {};
  if (r.bg) style.background = r.bg.css;
  if (content.design?.accent) {
    style["--primary"] = content.design.accent;
    // Companion hue for two-tone effects (orbs, mesh, waves…), so they follow
    // the page palette instead of the fixed site accent.
    const c2 = secondaryAccent(content.design.accent);
    if (c2) style["--fx-c2"] = c2;
  }
  if (r.bg?.light) Object.assign(style, LIGHT_VARS);
  // Global text color override (per-letter colors still win via inline runs).
  // Sets inherited color (headings/plain text), --text (elements using the
  // token) AND a translucent --text-muted so secondary text follows too.
  if (content.design?.textColor) {
    style.color = content.design.textColor;
    style["--text"] = content.design.textColor;
    style["--text-muted"] = `${content.design.textColor}b3`;
  }
  // Chosen page font applies to both body text and headings.
  const fam = fontFamilyVar(content.design?.font);
  if (fam) {
    style.fontFamily = fam;
    style["--font-display"] = fam;
  }
  if (layout.textScale) style["--ts"] = layout.textScale;
  if (layout.motionSpeed) style["--spd"] = layout.motionSpeed;
  const d: DesignClasses = {
    card: r.card,
    buttonFx: r.buttonFx,
    buttonIdle: r.buttonIdle,
    iconFx: r.iconFx,
    iconIdle: r.iconIdle,
    buttonShape: layout.buttonShape,
    buttonSize: layout.buttonSize,
  };

  return (
    <div
      style={style as React.CSSProperties}
      className={cn(
        "relative overflow-hidden",
        r.bg ? "" : "aura-backdrop",
        embedded ? "min-h-full" : "min-h-screen",
      )}
    >
      {content.design?.bgFx && INTERACTIVE_BG_FX.has(content.design.bgFx) ? (
        <CursorFx variant={content.design.bgFx as "cursorglow" | "cursorgrid" | "cursorspot"} />
      ) : (
        r.bgFx && (
          <div className={cn("pointer-events-none absolute inset-0", r.bgFx)} aria-hidden />
        )
      )}
      <div
        className={cn(
          "aura-typescale aura-stagger relative z-10 mx-auto flex flex-col px-5 py-14",
          layout.contentWidth,
          layout.spacing,
        )}
      >
        {content.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} pageId={trackPageId} d={d} />
        ))}
        {!hideBadge && (
          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text"
          >
            Made with <span className="font-display font-medium">AURA</span>
          </Link>
        )}
        {trackPageId && <ViewBeacon pageId={trackPageId} />}
      </div>
    </div>
  );
}
