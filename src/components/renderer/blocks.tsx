// Block components for PageRenderer. Server-renderable; interactive bits are
// small client islands (gallery, countdown, typewriter, count-up, forms,
// video facade).
import { ArrowUpRight, Check, ChevronDown, Mail, MapPin, Navigation, Phone, Star, UserPlus, UserRound } from "lucide-react";
import { RichTextView } from "@/components/rich-text-view";
import { GalleryView } from "./gallery-view";
import { CountdownView } from "./countdown-view";
import { HoursView } from "./hours-view";
import { Scheduled } from "./scheduled";
import { inWindow } from "@/lib/schedule";
import { Typewriter } from "./typewriter";
import { CountUp } from "./count-up";
import { FormView } from "./form-view";
import { VideoFacade } from "./video-facade";
import { cn } from "@/lib/utils";
import type { AvatarShape, BannerHeight, Block, BlockOf, LinkItem } from "@/lib/blocks";
import { avatarIdleClass, buttonFxClass, buttonIdleClass, iconFxClass, iconIdleClass } from "@/lib/design";
import { resolveImage } from "@/lib/image";
import type { ImageConfig, ImageRadius, ImageSize } from "@/lib/image";
import { SocialIcon, normalizeSocialUrl, brandColor, platformFromUrl } from "@/lib/socials";
import { toPlain, isEmptyRich } from "@/lib/richtext";
import type { RichValue } from "@/lib/richtext";
import { resolveHref, isExternal, type HrefMap } from "@/lib/links";
import type { Strings } from "@/lib/i18n";
import { vcard } from "@/lib/vcard";

export type RenderCtx = {
  /** Visitor-facing UI strings in the page's language. */
  t: Strings;
  /** Live page id: enables forms (and tracking, via hrefs). */
  pageId?: string;
  /** Live pages: when the HTML was built (scheduled links). */
  now?: number;
  hrefs?: HrefMap;
  card?: string;
  buttonFx?: string;
  buttonIdle?: string;
  iconFx?: string;
  iconIdle?: string;
  buttonShape?: string;
  buttonSize?: string;
};

const ALIGN: Record<string, string> = { left: "text-start", center: "text-center", right: "text-end" };

function Title({ value, as: Tag = "h2", className }: { value: RichValue; as?: "h1" | "h2"; className?: string }) {
  return (
    <Tag className={className}>
      <span className="tfx" data-text={toPlain(value)}>
        <RichTextView value={value} />
      </span>
    </Tag>
  );
}

function Link_({
  href,
  className,
  style,
  children,
  label,
}: {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  label?: string;
}) {
  const external = isExternal(href) || href.startsWith("/api/r");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

// ───────────────────────────── Hero ─────────────────────────────

const AVATAR_W: Record<ImageSize, string> = { sm: "w-16", md: "w-20", lg: "w-28", full: "w-36" };
const BANNER_H: Record<BannerHeight, string> = { sm: "h-24", md: "h-36", lg: "h-48" };
const SHAPE_RADIUS: Record<AvatarShape, ImageRadius> = { circle: "full", rounded: "lg", square: "sm" };

function Avatar({ b, px }: { b: BlockOf<"hero">; px?: number }) {
  const cfg: ImageConfig = b.avatar ?? { radius: b.avatarShape ? SHAPE_RADIUS[b.avatarShape] : "full" };
  const av = resolveImage(cfg, {
    lockWidth: AVATAR_W[cfg.size ?? "md"],
    defaultAspect: "square",
    defaultRadius: "full",
  });
  const width = px ?? b.avatarScale;
  const style = width ? { width: `${Math.min(Math.max(width, 40), 220)}px` } : undefined;
  return (
    <span className={cn("inline-flex shrink-0", avatarIdleClass(b.avatarIdle))}>
      <span className={cn("block border-2 border-bg shadow-xl", av.box)} style={style}>
        <div className={av.frame}>
          {b.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.avatarUrl} alt={toPlain(b.name)} fetchPriority="high" className={av.img} />
          ) : (
            <Initials name={toPlain(b.name)} />
          )}
        </div>
      </span>
    </span>
  );
}

/** No photo yet: the person's initials on an accent gradient. */
function Initials({ name }: { name: string }) {
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => Array.from(w)[0] ?? "")
    .join("")
    .toUpperCase();
  return (
    <span
      className="@container grid aspect-square h-full w-full place-items-center font-display font-medium text-white"
      style={{
        background:
          "radial-gradient(120% 120% at 20% 10%, color-mix(in oklab, var(--primary) 90%, #fff), var(--primary) 45%, color-mix(in oklab, var(--fx-c2, var(--accent)) 80%, #000))",
      }}
    >
      {letters ? (
        <span className="text-[38cqi] leading-none drop-shadow-sm">{letters}</span>
      ) : (
        <UserRound className="h-1/2 w-1/2" />
      )}
    </span>
  );
}

function HeroBadge({ text, onDark }: { text?: string; onDark?: boolean }) {
  if (!text?.trim()) return null;
  return (
    <span
      className={cn(
        "mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        onDark ? "border-white/25 bg-black/30 text-white backdrop-blur" : "border-border bg-surface/60 text-text backdrop-blur",
      )}
    >
      <span className="pg-badge-dot h-1.5 w-1.5 rounded-full bg-primary" />
      {text}
    </span>
  );
}

function Tagline({ b, className }: { b: BlockOf<"hero">; className?: string }) {
  const words = (b.words ?? []).filter((w) => w.trim());
  if (isEmptyRich(b.tagline) && words.length === 0) return null;
  return (
    <p className={cn("pg-p mt-2 text-text-muted [--p:0.95rem]", className)}>
      <RichTextView value={b.tagline} />
      {words.length > 0 && (
        <>
          {!isEmptyRich(b.tagline) && " "}
          <Typewriter words={words} typing={b.typing} />
        </>
      )}
    </p>
  );
}

export function HeroBlock({ b }: { b: BlockOf<"hero"> }) {
  const layout = b.layout ?? "center";

  if (layout === "cover") {
    return (
      <div className="pg-hero pg-cover -mx-2 overflow-hidden rounded-[28px] shadow-2xl">
        <div className="relative flex min-h-[320px] flex-col justify-end">
          {b.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.bannerUrl} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 70% at 20% 10%, var(--primary), transparent 60%), radial-gradient(80% 70% at 90% 30%, var(--fx-c2, var(--accent)), transparent 60%), #0b0c12",
              }}
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="relative flex flex-col items-start p-5 text-start text-white [--text:#fff] [--text-muted:rgba(255,255,255,0.75)]">
            <div className="mb-3">
              <Avatar b={b} px={b.avatarScale ?? 64} />
            </div>
            <HeroBadge text={b.badge} onDark />
            <Title value={b.name} as="h1" className="pg-title" />
            <Tagline b={b} />
          </div>
        </div>
      </div>
    );
  }

  if (layout === "big") {
    return (
      <div className="pg-hero pg-big flex flex-col items-start text-start">
        <div className="mb-5 flex items-center gap-3">
          <Avatar b={b} px={b.avatarScale ?? 56} />
          <HeroBadge text={b.badge} />
        </div>
        <Title value={b.name} as="h1" className="pg-title !leading-[0.95]" />
        <Tagline b={b} className="mt-4 [--p:1.05rem]" />
      </div>
    );
  }

  if (layout === "left") {
    return (
      <div className="pg-hero flex items-center gap-4 text-start">
        <Avatar b={b} px={b.avatarScale ?? 76} />
        <div className="min-w-0">
          <HeroBadge text={b.badge} />
          <Title value={b.name} as="h1" className="pg-title" />
          <Tagline b={b} className="mt-1" />
        </div>
      </div>
    );
  }

  if (layout === "split") {
    return (
      <div className="pg-hero flex flex-col items-center gap-5 text-center @md/page:flex-row @md/page:text-start">
        <Avatar b={b} px={b.avatarScale ?? 132} />
        <div className="flex min-w-0 flex-col items-center @md/page:items-start">
          <HeroBadge text={b.badge} />
          <Title value={b.name} as="h1" className="pg-title [--h1:1.9rem]" />
          <Tagline b={b} />
        </div>
      </div>
    );
  }

  // center (classic) — keeps the original banner behavior
  let bannerEl: React.ReactNode = null;
  if (b.bannerUrl) {
    const useLegacy = !b.banner && !!b.bannerHeight;
    const bn = resolveImage(b.banner, {
      lockWidth: "w-full",
      defaultAspect: useLegacy ? "auto" : "wide",
      defaultRadius: "lg",
    });
    bannerEl = (
      <div className="-mx-5 mb-3 w-[calc(100%+2.5rem)]">
        <div className={cn(bn.box, useLegacy && b.bannerHeight && BANNER_H[b.bannerHeight])}>
          <div className={cn(bn.frame, useLegacy && "h-full")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.bannerUrl}
              alt=""
              fetchPriority="high"
              className={useLegacy ? "h-full w-full object-cover" : bn.img}
            />
          </div>
        </div>
        <div className="-mt-10 flex justify-center">
          <Avatar b={b} />
        </div>
      </div>
    );
  }
  return (
    <div className="pg-hero flex flex-col items-center text-center">
      {bannerEl ?? (
        <div className="mb-4">
          <Avatar b={b} />
        </div>
      )}
      <HeroBadge text={b.badge} />
      <Title value={b.name} as="h1" className="pg-title" />
      <Tagline b={b} />
    </div>
  );
}

// ───────────────────────────── Links ─────────────────────────────

function LinkLead({ item, round }: { item: LinkItem; round: boolean }) {
  if (item.thumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.thumb}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", round ? "rounded-full" : "rounded-[10px]")}
      />
    );
  }
  if (item.icon === "auto") return <SocialIcon platform={platformFromUrl(item.url)} className="h-[18px] w-[18px]" />;
  if (item.icon) return <span className="text-lg leading-none">{item.icon}</span>;
  return null;
}

function linkStyle(l: LinkItem): React.CSSProperties | undefined {
  if (!l.color) return undefined;
  return l.highlighted
    ? { background: l.color, color: "#fff", borderColor: l.color }
    : { borderColor: l.color, color: l.color };
}

/** Tiles can't be pills — map the page's button shape onto a tile radius. */
function tileRadius(shape?: string) {
  if (!shape || shape.includes("rounded-full")) return "rounded-3xl";
  return shape;
}

export function LinksBlock({ b, ctx }: { b: BlockOf<"links">; ctx: RenderCtx }) {
  const layout = b.layout ?? "list";
  const fxDefault = buttonFxClass(b.buttonFx) ?? ctx.buttonFx;
  const idle = buttonIdleClass(b.buttonIdle) ?? ctx.buttonIdle;
  const surface = (l: LinkItem) =>
    l.color ? "border" : l.highlighted ? "aura-glow bg-primary text-primary-ink" : (ctx.card ?? "border border-border bg-surface-2 text-text");
  const fx = (l: LinkItem) => buttonFxClass(l.fx) ?? fxDefault ?? "transition-all duration-150 hover:brightness-110";
  // The editor shows every link; live pages gate the scheduled ones.
  const gate = (l: LinkItem, i: number, node: React.ReactNode) =>
    ctx.pageId && (l.from || l.until) ? (
      <Scheduled key={i} from={l.from} until={l.until} shown={ctx.now === undefined || inWindow(l.from, l.until, ctx.now)}>
        {node}
      </Scheduled>
    ) : (
      node
    );

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {b.items.map((l, i) => {
          const lead = <LinkLead item={l} round={false} />;
          return gate(
            l,
            i,
            <div key={i} className={idle}>
              <Link_
                href={resolveHref(l.url, ctx.hrefs)}
                style={linkStyle(l)}
                className={cn(
                  "flex h-full flex-col overflow-hidden text-center font-medium",
                  tileRadius(ctx.buttonShape),
                  surface(l),
                  fx(l),
                )}
              >
                {l.thumb ? (
                  <span className="block aspect-[4/3] w-full overflow-hidden">{lead}</span>
                ) : (
                  <span className="grid h-14 place-items-center pt-3 text-2xl">
                    {lead ?? <ArrowUpRight className="h-5 w-5 opacity-70" />}
                  </span>
                )}
                <span className="flex flex-1 flex-col justify-center px-3 py-2.5 text-sm leading-tight">
                  <RichTextView value={l.label} />
                  {l.sub && <span className="mt-0.5 text-[11px] font-normal opacity-70">{l.sub}</span>}
                </span>
              </Link_>
            </div>,
          );
        })}
      </div>
    );
  }

  if (layout === "cards") {
    return (
      <div className="space-y-2.5">
        {b.items.map((l, i) =>
          gate(
            l,
            i,
            <div key={i} className={idle}>
            <Link_
              href={resolveHref(l.url, ctx.hrefs)}
              style={linkStyle(l)}
              className={cn(
                "flex min-h-16 items-center gap-3 p-2.5 text-start font-medium",
                tileRadius(ctx.buttonShape),
                surface(l),
                fx(l),
              )}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/15">
                <LinkLead item={l} round={false} /> {!l.thumb && !l.icon && <ArrowUpRight className="h-5 w-5 opacity-70" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-sm leading-tight">
                <span className="truncate">
                  <RichTextView value={l.label} />
                </span>
                {l.sub && <span className="mt-0.5 truncate text-xs font-normal opacity-70">{l.sub}</span>}
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 opacity-60 rtl:-scale-x-100" />
            </Link_>
          </div>,
          ),
        )}
      </div>
    );
  }

  const round = !ctx.buttonShape || ctx.buttonShape.includes("rounded-full");
  return (
    <div className="space-y-2.5">
      {b.items.map((l, i) => {
        const hasLead = !!(l.thumb || l.icon);
        return gate(
          l,
          i,
          <div key={i} className={idle}>
            <Link_
              href={resolveHref(l.url, ctx.hrefs)}
              style={linkStyle(l)}
              className={cn(
                "relative flex items-center justify-center font-medium",
                ctx.buttonShape ?? "rounded-full",
                l.sub ? "min-h-14 py-2 text-sm" : (ctx.buttonSize ?? "h-12 text-sm"),
                surface(l),
                fx(l),
              )}
            >
              {hasLead && (
                <span className="absolute inset-y-1.5 start-1.5 grid aspect-square place-items-center overflow-hidden">
                  <LinkLead item={l} round={round} />
                </span>
              )}
              <span className={cn("flex flex-col items-center leading-tight", hasLead ? "px-12" : "px-5")}>
                <RichTextView value={l.label} />
                {l.sub && <span className="mt-0.5 text-[11px] font-normal opacity-70">{l.sub}</span>}
              </span>
            </Link_>
          </div>,
        );
      })}
    </div>
  );
}

// ───────────────────────────── Text & socials ─────────────────────────────

const H2_SIZE = { sm: "[--h2:1rem]", md: "[--h2:1.15rem]", lg: "[--h2:1.6rem]" };
const P_SIZE = { sm: "[--p:0.8rem]", md: "[--p:0.9rem]", lg: "[--p:1.05rem]" };

export function TextBlock({ b, ctx }: { b: BlockOf<"text">; ctx: RenderCtx }) {
  const size = b.size ?? "md";
  const body = (
    <p
      className={cn("pg-p leading-relaxed", P_SIZE[size], b.color ? "" : "text-text-muted")}
      style={b.color ? { color: b.color } : undefined}
    >
      <RichTextView value={b.body} />
    </p>
  );
  return (
    <div className={ALIGN[b.align ?? "left"]} style={b.color ? { color: b.color } : undefined}>
      {!isEmptyRich(b.heading) && <Title value={b.heading!} className={cn("pg-h2 mb-2", H2_SIZE[size])} />}
      {b.spoiler ? (
        <details className="group rounded-xl border border-border bg-surface/40 px-4 py-2.5">
          <summary className="cursor-pointer list-none text-sm font-medium text-text select-none">
            <span className="text-primary">▸</span> {ctx.t.spoiler}
          </summary>
          <div className="mt-2">{body}</div>
        </details>
      ) : (
        body
      )}
    </div>
  );
}

const ICON_SIZE = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" };
const CHIP_SIZE = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-14 w-14" };

export function SocialsBlock({ b, ctx }: { b: BlockOf<"socials">; ctx: RenderCtx }) {
  const style = b.iconStyle ?? "plain";
  const size = b.size ?? "md";
  const fx = iconFxClass(b.iconFx) ?? ctx.iconFx;
  const idle = iconIdleClass(b.iconIdle) ?? ctx.iconIdle;
  return (
    <div
      className={cn("flex flex-wrap justify-center text-text-muted", style === "plain" ? "gap-5" : "gap-2.5")}
      style={b.iconColor ? { color: b.iconColor } : undefined}
    >
      {b.items.map((s, i) => {
        const href = ctx.hrefs?.[s.url.trim()] ?? normalizeSocialUrl(s.platform, s.url);
        return (
          <Link_
            key={i}
            href={href}
            label={s.platform}
            className={cn("inline-flex", fx ?? "transition-colors hover:text-text")}
          >
            <span
              className={cn(
                "inline-flex",
                idle,
                style !== "plain" && cn("items-center justify-center rounded-full", CHIP_SIZE[size]),
                style === "chip" && "border border-border bg-surface-2/80 text-text backdrop-blur",
                style === "brand" && "text-white shadow-lg",
              )}
              style={style === "brand" ? { background: brandColor(s.platform) } : undefined}
            >
              <SocialIcon platform={s.platform} className={style === "plain" ? ICON_SIZE[size] : ICON_SIZE[size === "lg" ? "md" : "sm"]} />
            </span>
          </Link_>
        );
      })}
    </div>
  );
}

// ───────────────────────────── Media ─────────────────────────────

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function VideoBlock({ b, ctx }: { b: BlockOf<"video">; ctx: RenderCtx }) {
  const title = toPlain(b.title) || "Video";
  const yt = youtubeId(b.url);
  const vm = !yt ? vimeoId(b.url) : null;
  const player = yt
    ? { src: `https://www.youtube-nocookie.com/embed/${yt}`, poster: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` }
    : vm
      ? { src: `https://player.vimeo.com/video/${vm}`, poster: undefined }
      : null;
  return (
    <div>
      {!isEmptyRich(b.title) && player && <Title value={b.title!} className="pg-h2 mb-2.5 text-center" />}
      {player ? (
        <VideoFacade src={player.src} poster={player.poster} title={title} />
      ) : (
        <Link_
          href={resolveHref(b.url, ctx.hrefs)}
          className="flex h-12 items-center justify-center rounded-full border border-border bg-surface-2 text-sm font-medium text-text"
        >
          {isEmptyRich(b.title) ? ctx.t.watch : <RichTextView value={b.title} />}
        </Link_>
      )}
    </div>
  );
}

export function ImageBlock({ b }: { b: BlockOf<"image"> }) {
  if (!b.url) return null;
  const r = resolveImage(b.img, { defaultSize: "full", defaultAspect: "auto", defaultRadius: "md" });
  return (
    <figure className={cn("mx-auto border border-border", r.box)}>
      <div className={r.frame}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={b.url} alt={b.alt ?? ""} loading="lazy" decoding="async" className={r.img} />
      </div>
      {!isEmptyRich(b.caption) && (
        <figcaption className="bg-surface px-4 py-2 text-xs text-text-muted">
          <RichTextView value={b.caption} />
        </figcaption>
      )}
    </figure>
  );
}

export function GalleryBlock({ b }: { b: BlockOf<"gallery"> }) {
  const valid = b.images.filter((i) => i.url);
  if (valid.length === 0) return null;
  const aspect = b.layout === "carousel" ? "wide" : "square";
  const r = resolveImage(b.img, { lockWidth: "w-full", defaultAspect: aspect, defaultRadius: "sm" });
  return <GalleryView images={valid} layout={b.layout} box={r.box} frame={r.frame} img={r.img} />;
}

export function FaqBlock({ b }: { b: BlockOf<"faq"> }) {
  return (
    <div className={cn("divide-y divide-border overflow-hidden rounded-2xl border border-border", ALIGN[b.align ?? "left"])}>
      {b.items.map((f, i) => (
        <details key={i} className="group px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium">
            <RichTextView value={f.question} />
            <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="pg-p mt-2 leading-relaxed text-text-muted">
            <RichTextView value={f.answer} />
          </p>
        </details>
      ))}
    </div>
  );
}

const EMBED_H = { sm: "h-60", md: "h-80", lg: "h-[480px]" };

export function EmbedBlock({ b }: { b: BlockOf<"embed"> }) {
  if (!/^https:\/\//i.test(b.url)) {
    return <p className="text-center text-sm text-text-muted">הוסיפו כתובת https להטמעה…</p>;
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <iframe
        src={b.url}
        title="Embedded content"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation allow-forms"
        className={cn("w-full", EMBED_H[b.height ?? "md"])}
      />
    </div>
  );
}

function musicEmbed(url: string): { src: string; height: number } | null {
  try {
    const u = new URL(url);
    if (u.hostname === "open.spotify.com") {
      const m = u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]+)/);
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

export function MusicBlock({ b }: { b: BlockOf<"music"> }) {
  const embed = musicEmbed(b.url);
  if (!embed) {
    return <p className="text-center text-sm text-text-muted">הדביקו קישור מ־Spotify, ‏SoundCloud או Apple Music…</p>;
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

export function DividerBlock({ b }: { b: BlockOf<"divider"> }) {
  const style = b.style ?? "line";
  if (!b.color && style === "line") return <div className="aura-rule" />;
  return (
    <div
      className={cn("dv", `dv-${style}`)}
      style={b.color ? ({ "--dvc": b.color } as React.CSSProperties) : undefined}
    />
  );
}

// ───────────────────────────── Landing-page blocks ─────────────────────────────

const MQ_DUR = { slow: "42s", normal: "26s", fast: "14s" };

export function MarqueeBlock({ b }: { b: BlockOf<"marquee"> }) {
  const style = b.style ?? "plain";
  const text = b.text.trim() || "Your message here";
  const unit = (k: number) => (
    <span key={k} className="mq-item" aria-hidden={k > 0}>
      {text}
      <span className={style === "band" || style === "tilt" ? "opacity-60" : "text-primary"}>✦</span>
    </span>
  );
  const run = Array.from({ length: 6 }, (_, i) => unit(i));
  return (
    <div
      className={cn(
        "mq font-display text-xl font-medium tracking-tight",
        `mq-${style}`,
        b.reverse && "mq-rev",
        style === "band" || style === "tilt" ? "-mx-5 py-3" : "py-1",
        style === "outline" && "text-3xl",
      )}
      style={{ "--mq-dur": MQ_DUR[b.speed ?? "normal"] } as React.CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <div className="mq-track">
        {run}
        {Array.from({ length: 6 }, (_, i) => unit(i + 6))}
      </div>
    </div>
  );
}

const FEATURE_COLS = {
  1: "grid-cols-1",
  2: "grid-cols-1 @xs/page:grid-cols-2",
  3: "grid-cols-2 @2xl/page:grid-cols-3",
};

export function FeaturesBlock({ b }: { b: BlockOf<"features"> }) {
  return (
    <div>
      {b.heading && <Title value={b.heading} className="pg-h2 mb-4 text-center [--h2:1.4rem]" />}
      <div className={cn("grid gap-2.5", FEATURE_COLS[b.cols ?? 2])}>
        {b.items.map((f, i) => (
          <div key={i} className="rounded-2xl border border-border bg-surface/50 p-4 text-start backdrop-blur-sm">
            {f.icon && (
              <span
                className="mb-3 grid h-10 w-10 place-items-center rounded-xl text-xl"
                style={{ background: "color-mix(in oklab, var(--primary) 16%, transparent)" }}
              >
                {f.icon}
              </span>
            )}
            <p className="text-sm font-medium text-text">{f.title}</p>
            {f.text && <p className="pg-p mt-1 leading-relaxed text-text-muted [--p:0.8rem]">{f.text}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <span role="img" className="flex gap-0.5 text-amber-400" aria-label={`${n}/5 ★`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i < n ? "fill-current" : "opacity-30")} />
      ))}
    </span>
  );
}

export function TestimonialsBlock({ b }: { b: BlockOf<"testimonials"> }) {
  const cards = b.items.map((t, i) => (
    <figure key={i} className="flex flex-col rounded-2xl border border-border bg-surface/60 p-4 text-start backdrop-blur-sm">
      {t.rating ? <Stars n={Math.min(5, Math.max(1, Math.round(t.rating)))} /> : null}
      <blockquote className="pg-p mt-2 flex-1 leading-relaxed text-text">
        <span className="font-display text-2xl leading-none text-primary">“</span>
        {t.quote}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2.5">
        {t.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.avatar} alt="" loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-xs font-medium text-primary">
            {t.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-medium text-text">{t.name}</span>
          {t.role && <span className="block truncate text-xs text-text-muted">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  ));
  return (
    <div>
      {b.heading && <Title value={b.heading} className="pg-h2 mb-4 text-center [--h2:1.4rem]" />}
      {b.layout === "carousel" ? (
        <div className="snap-row">{cards}</div>
      ) : (
        <div className="grid gap-2.5 @2xl/page:grid-cols-2">{cards}</div>
      )}
    </div>
  );
}

export function StatsBlock({ b }: { b: BlockOf<"stats"> }) {
  const n = b.items.length;
  return (
    <div className={cn("grid gap-2.5", n === 1 ? "grid-cols-1" : n === 3 ? "grid-cols-3" : "grid-cols-2 @xl/page:grid-cols-4")}>
      {b.items.map((s, i) => (
        <div key={i} className="rounded-2xl border border-border bg-surface/50 px-2 py-4 text-center backdrop-blur-sm">
          <p className="font-display text-[1.75rem] leading-none font-medium tracking-tight text-primary">
            <CountUp value={s.value} />
          </p>
          <p className="mt-1.5 text-[11px] tracking-wide text-text-muted uppercase">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export function PricingBlock({ b, ctx }: { b: BlockOf<"pricing">; ctx: RenderCtx }) {
  return (
    <div>
      {b.heading && <Title value={b.heading} className="pg-h2 mb-4 text-center [--h2:1.4rem]" />}
      <div className={cn("grid gap-3", b.items.length > 1 && "@2xl/page:grid-cols-2")}>
        {b.items.map((p, i) => (
          <div
            key={i}
            className={cn(
              "relative flex flex-col rounded-3xl border p-5 text-start backdrop-blur-sm",
              p.featured ? "aura-glow border-primary/70 bg-surface/80" : "border-border bg-surface/50",
            )}
          >
            {p.featured && (
              <span className="absolute -top-2.5 start-5 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-medium text-primary-ink">
                {ctx.t.popular}
              </span>
            )}
            <p className="text-sm font-medium text-text">{p.name}</p>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-medium tracking-tight text-text">{p.price}</span>
              {p.period && <span className="text-sm text-text-muted">{p.period}</span>}
            </p>
            {p.features && (
              <ul className="mt-4 flex-1 space-y-2">
                {p.features
                  .split("\n")
                  .map((f) => f.trim())
                  .filter(Boolean)
                  .map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
              </ul>
            )}
            {p.cta && (
              <Link_
                href={resolveHref(p.url, ctx.hrefs)}
                className={cn(
                  "mt-5 flex h-11 items-center justify-center text-sm font-medium",
                  ctx.buttonShape ?? "rounded-full",
                  p.featured ? "aura-glow bg-primary text-primary-ink" : (ctx.card ?? "border border-border bg-surface-2 text-text"),
                  ctx.buttonFx ?? "transition-all hover:brightness-110",
                )}
              >
                {p.cta}
              </Link_>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormBlock({ b, ctx }: { b: BlockOf<"form">; ctx: RenderCtx }) {
  return (
    <div className="text-center">
      {b.heading && <Title value={b.heading} className="pg-h2 [--h2:1.35rem]" />}
      {b.text && <p className="pg-p mx-auto mt-1.5 mb-4 max-w-sm text-text-muted">{b.text}</p>}
      {!b.text && b.heading && <div className="h-3" />}
      <FormView
        pageId={ctx.pageId}
        blockId={b.id}
        kind={b.kind}
        button={b.button}
        success={b.success}
        t={ctx.t}
      />
    </div>
  );
}

const MAP_H = { sm: "h-48", md: "h-64", lg: "h-96" };

export function MapBlock({ b, ctx }: { b: BlockOf<"map">; ctx: RenderCtx }) {
  const q = b.query.trim();
  if (!q) return <p className="text-center text-sm text-text-muted">הוסיפו כתובת או שם מקום…</p>;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface/60">
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`}
        title={`Map of ${q}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn("w-full border-0", MAP_H[b.height ?? "md"])}
      />
      <div className="flex items-center gap-2 px-3 py-2.5 text-xs">
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate text-text-muted">{q}</span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border px-2.5 py-1 text-text hover:border-primary/60"
        >
          {ctx.t.maps}
        </a>
        <a
          href={`https://waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-text hover:border-primary/60"
        >
          <Navigation className="h-3 w-3" /> Waze
        </a>
      </div>
    </div>
  );
}

function ContactBlock({ b, ctx }: { b: BlockOf<"contact">; ctx: RenderCtx }) {
  // Live pages serve the card from the API (phones open it as a contact);
  // the editor preview falls back to an inline file.
  const save = ctx.pageId
    ? `/api/vcard?p=${encodeURIComponent(ctx.pageId)}&b=${encodeURIComponent(b.id)}`
    : `data:text/vcard;charset=utf-8,${encodeURIComponent(vcard(b))}`;
  const sub = [b.role, b.org].filter(Boolean).join(" · ");
  const chip = cn("flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-surface-2 text-text", ctx.buttonShape ?? "rounded-full");
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-4 backdrop-blur">
      <p className="font-display text-lg font-medium">{b.name || "—"}</p>
      {sub && <p className="text-sm text-text-muted">{sub}</p>}
      <div className="mt-4 flex gap-2">
        <a
          href={save}
          download={`${(b.name || "contact").replace(/[^\p{L}\p{N} _-]/gu, "").trim() || "contact"}.vcf`}
          className={cn(
            "flex h-11 flex-1 items-center justify-center gap-2 bg-primary text-sm font-medium text-primary-ink",
            ctx.buttonShape ?? "rounded-full",
            ctx.buttonFx ?? "transition-all hover:brightness-110",
          )}
        >
          <UserPlus className="h-4 w-4" /> {ctx.t.saveContact}
        </a>
        {b.phone && (
          <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className={chip} aria-label={ctx.t.call}>
            <Phone className="h-4 w-4" />
          </a>
        )}
        {b.email && (
          <a href={`mailto:${b.email}`} className={chip} aria-label="Email">
            <Mail className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

const SPACER_H = { sm: "h-3", md: "h-8", lg: "h-16", xl: "h-28" };

export function BlockView({ block, ctx }: { block: Block; ctx: RenderCtx }) {
  switch (block.type) {
    case "hero":
      return <HeroBlock b={block} />;
    case "links":
      return <LinksBlock b={block} ctx={ctx} />;
    case "text":
      return <TextBlock b={block} ctx={ctx} />;
    case "socials":
      return <SocialsBlock b={block} ctx={ctx} />;
    case "video":
      return <VideoBlock b={block} ctx={ctx} />;
    case "image":
      return <ImageBlock b={block} />;
    case "gallery":
      return <GalleryBlock b={block} />;
    case "faq":
      return <FaqBlock b={block} />;
    case "divider":
      return <DividerBlock b={block} />;
    case "embed":
      return <EmbedBlock b={block} />;
    case "music":
      return <MusicBlock b={block} />;
    case "countdown":
      return <CountdownView target={block.target} label={block.label} t={ctx.t} />;
    case "marquee":
      return <MarqueeBlock b={block} />;
    case "features":
      return <FeaturesBlock b={block} />;
    case "testimonials":
      return <TestimonialsBlock b={block} />;
    case "stats":
      return <StatsBlock b={block} />;
    case "pricing":
      return <PricingBlock b={block} ctx={ctx} />;
    case "form":
      return <FormBlock b={block} ctx={ctx} />;
    case "map":
      return <MapBlock b={block} ctx={ctx} />;
    case "hours":
      return <HoursView b={block} t={ctx.t} />;
    case "contact":
      return <ContactBlock b={block} ctx={ctx} />;
    case "spacer":
      return <div className={SPACER_H[block.size ?? "md"]} aria-hidden />;
    default:
      return null;
  }
}
