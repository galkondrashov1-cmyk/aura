import Link from "next/link";
import { AuraMark } from "@/components/aura-logo";
import { ViewBeacon } from "@/components/view-beacon";
import { cn } from "@/lib/utils";
import type {
  Block,
  PageContent,
  SocialPlatform,
  AvatarShape,
  BannerHeight,
} from "@/lib/blocks";
import { resolveDesign, resolveLayout, LIGHT_VARS, avatarIdleClass } from "@/lib/design";
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
  const avatarEl = (
    <span className={cn("inline-flex", idle)}>
      <span className={cn("block border-2 border-bg", av.box)}>
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
  items: { label: RichValue; url: string; highlighted?: boolean }[];
  pageId?: string;
  cardClass?: string;
  buttonFx?: string;
  buttonIdle?: string;
  buttonShape?: string;
  buttonSize?: string;
}) {
  return (
    <div className="space-y-2.5">
      {items.map((l, i) => (
        <div key={i} className={buttonIdle}>
          <a
            href={trackedHref(pageId, l.url, toPlain(l.label))}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center font-medium",
              buttonShape ?? "rounded-full",
              buttonSize ?? "h-12 text-sm",
              l.highlighted
                ? "aura-glow bg-primary text-primary-ink"
                : (cardClass ?? "border border-border bg-surface-2 text-text"),
              buttonFx ?? "transition-all duration-150 hover:brightness-110",
            )}
          >
            <RichTextView value={l.label} />
          </a>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ heading, body }: { heading?: RichValue; body: RichValue }) {
  return (
    <div>
      {!isEmptyRich(heading) && (
        <h2 className="font-display mb-2 text-lg font-medium tracking-tight">
          <RichTextView value={heading} />
        </h2>
      )}
      <p className="text-sm leading-relaxed text-text-muted">
        <RichTextView value={body} />
      </p>
    </div>
  );
}

function SocialsBlock({
  items,
  pageId,
  iconFx,
  iconIdle,
}: {
  items: { platform: SocialPlatform; url: string }[];
  pageId?: string;
  iconFx?: string;
  iconIdle?: string;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-5 text-text-muted">
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
}: {
  images: { url: string; alt?: string }[];
  img?: ImageConfig;
}) {
  const valid = images.filter((i) => i.url);
  if (valid.length === 0) return null;
  const r = resolveImage(img, { lockWidth: "w-full", defaultAspect: "square", defaultRadius: "sm" });
  return (
    <div className="grid grid-cols-2 gap-2">
      {valid.map((image, i) => (
        <div key={i} className={cn("border border-border", r.box)}>
          <div className={r.frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt ?? ""} className={r.img} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqBlock({ items }: { items: { question: RichValue; answer: RichValue }[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
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
          buttonFx={d.buttonFx}
          buttonIdle={d.buttonIdle}
          buttonShape={d.buttonShape}
          buttonSize={d.buttonSize}
        />
      );
    case "text":
      return <TextBlock heading={block.heading} body={block.body} />;
    case "socials":
      return (
        <SocialsBlock
          items={block.items}
          pageId={pageId}
          iconFx={d.iconFx}
          iconIdle={d.iconIdle}
        />
      );
    case "video":
      return <VideoBlock url={block.url} title={block.title} />;
    case "image":
      return (
        <ImageBlock url={block.url} alt={block.alt} caption={block.caption} img={block.img} />
      );
    case "gallery":
      return <GalleryBlock images={block.images} img={block.img} />;
    case "faq":
      return <FaqBlock items={block.items} />;
    case "divider":
      return <div className="aura-rule" />;
    default:
      return null;
  }
}

export function PageRenderer({
  content,
  embedded = false,
  trackPageId,
}: {
  content: PageContent;
  embedded?: boolean;
  trackPageId?: string;
}) {
  const r = resolveDesign(content.design);
  const layout = resolveLayout(content.design);
  const style: Record<string, string> = {};
  if (r.bg) style.background = r.bg.css;
  if (content.design?.accent) style["--primary"] = content.design.accent;
  if (r.bg?.light) Object.assign(style, LIGHT_VARS);
  // Global text color override (per-letter colors still win via inline runs).
  if (content.design?.textColor) style["--text"] = content.design.textColor;
  // Chosen page font applies to both body text and headings.
  const fam = fontFamilyVar(content.design?.font);
  if (fam) {
    style.fontFamily = fam;
    style["--font-display"] = fam;
  }
  if (layout.textScale) style["--ts"] = layout.textScale;
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
      {r.bgFx && (
        <div className={cn("pointer-events-none absolute inset-0", r.bgFx)} aria-hidden />
      )}
      <div
        className={cn(
          "aura-typescale relative z-10 mx-auto flex flex-col px-5 py-14",
          layout.contentWidth,
          layout.spacing,
        )}
      >
        {content.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} pageId={trackPageId} d={d} />
        ))}
        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text"
        >
          Made with <span className="font-display font-medium">AURA</span>
        </Link>
        {trackPageId && <ViewBeacon pageId={trackPageId} />}
      </div>
    </div>
  );
}
