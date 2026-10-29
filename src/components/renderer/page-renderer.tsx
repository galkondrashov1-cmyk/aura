import Link from "next/link";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { AuraMark } from "@/components/aura-logo";
import { ViewBeacon } from "@/components/view-beacon";
import { CursorFx } from "./cursor-fx";
import { PageIntro } from "./page-intro";
import { LiveBackground, CustomCursor } from "./live-background";
import { BlockView, type RenderCtx } from "./blocks";
import { cn } from "@/lib/utils";
import type { Block, PageContent, PageDesign } from "@/lib/blocks";
import { resolveDesign, resolveLayout, INTERACTIVE_BG_FX, secondaryAccent } from "@/lib/design";
import {
  HEADING_CASES,
  HEADING_TRACKING,
  HEADING_WEIGHTS,
  LIGHT_VARS,
  looksRtl,
  resolveBackground,
} from "@/lib/studio";
import { fontFamilyVar, fontsHref } from "@/lib/fonts";
import { SocialIcon } from "@/lib/socials";
import { toPlain } from "@/lib/richtext";
import { resolveHref, type HrefMap } from "@/lib/links";
import { detectLang, strings } from "@/lib/i18n";

// Blocks that never sit inside the page-default container.
const BARE: Block["type"][] = ["hero", "spacer", "divider", "marquee"];

/** Direction + UI language, from the setting or (auto) the page's own words. */
function pageLocale(content: PageContent) {
  const sample = content.blocks
    .slice(0, 5)
    .map((b) =>
      b.type === "hero"
        ? `${toPlain(b.name)} ${toPlain(b.tagline)}`
        : b.type === "text"
          ? toPlain(b.body)
          : b.type === "links"
            ? b.items.map((l) => toPlain(l.label)).join(" ")
            : "",
    )
    .join(" ");
  const d = content.design?.dir;
  const dir: "ltr" | "rtl" = d === "rtl" || d === "ltr" ? d : looksRtl(sample) ? "rtl" : "ltr";
  return { dir, lang: dir === "rtl" ? detectLang(sample) : ("en" as const) };
}

function sectionRadius(shape?: string) {
  if (shape === "sharp" || shape === "slant") return "6px";
  if (shape === "soft") return "18px";
  return undefined;
}

function FloatingButton({
  fab,
  hrefs,
  embedded,
}: {
  fab: NonNullable<PageDesign["fab"]>;
  hrefs?: HrefMap;
  embedded: boolean;
}) {
  const v = fab.value.trim();
  const href =
    fab.kind === "whatsapp"
      ? `https://wa.me/${v.replace(/[^\d]/g, "")}`
      : fab.kind === "phone"
        ? `tel:${v.replace(/[^\d+]/g, "")}`
        : fab.kind === "email"
          ? `mailto:${v}`
          : resolveHref(v, hrefs);
  const icon =
    fab.kind === "whatsapp" ? (
      <SocialIcon platform="whatsapp" className="h-5 w-5" />
    ) : fab.kind === "phone" ? (
      <Phone className="h-5 w-5" />
    ) : fab.kind === "email" ? (
      <Mail className="h-5 w-5" />
    ) : (
      <ExternalLink className="h-5 w-5" />
    );
  return (
    <div className={embedded ? "pg-fab pg-fab-embedded z-20" : "pg-fab"}>
      <a
        href={href}
        target={/^https?:/.test(href) || href.startsWith("/api/r") ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label={fab.label || fab.kind}
        className={cn(
          "flex h-14 items-center gap-2 rounded-full px-4 text-sm font-medium text-white shadow-2xl",
          !fab.label && "w-14 justify-center px-0",
        )}
        style={{ background: fab.kind === "whatsapp" ? "#25D366" : "var(--primary)", color: fab.kind === "whatsapp" ? "#fff" : "var(--primary-ink)" }}
      >
        {icon}
        {fab.label && <span>{fab.label}</span>}
      </a>
    </div>
  );
}

export function PageRenderer({
  content,
  embedded = false,
  trackPageId,
  hrefs,
  hideBadge = false,
  editable = false,
  selectedId,
  thumbnail = false,
}: {
  content: PageContent;
  /** Rendered inside the editor canvas / a thumbnail rather than as the page. */
  embedded?: boolean;
  /** Live page id — enables view tracking and forms. */
  trackPageId?: string;
  /** Signed click-tracking hrefs (built on the server for live pages). */
  hrefs?: HrefMap;
  hideBadge?: boolean;
  /** Editor canvas: blocks are tappable and outlined. */
  editable?: boolean;
  selectedId?: string;
  /** Static preview (dashboard cards, template gallery): no canvases, no floating UI. */
  thumbnail?: boolean;
}) {
  const design = content.design ?? {};
  const r = resolveDesign(design);
  const layout = resolveLayout(design);
  const bg = resolveBackground(design);
  const { dir, lang } = pageLocale(content);

  const style: Record<string, string> = {};
  if (bg.css) style.background = bg.css;
  if (design.accent) {
    style["--primary"] = design.accent;
    // Companion hue for two-tone effects (orbs, mesh, waves…), so they follow
    // the page palette instead of the fixed site accent.
    const c2 = secondaryAccent(design.accent);
    if (c2) style["--fx-c2"] = c2;
  }
  if (bg.light) Object.assign(style, LIGHT_VARS);
  // Global text color override (per-letter colors still win via inline runs).
  if (design.textColor) {
    style.color = design.textColor;
    style["--text"] = design.textColor;
    style["--text-muted"] = `${design.textColor}b3`;
  }
  // Body font everywhere; headings get their own font when one is paired.
  const body = fontFamilyVar(design.font);
  const head = fontFamilyVar(design.headingFont) ?? body;
  if (body) style.fontFamily = body;
  if (head) style["--font-display"] = head;
  const hw = HEADING_WEIGHTS.find((x) => x.id === design.headingWeight);
  if (hw) style["--hw"] = hw.value;
  const hc = HEADING_CASES.find((x) => x.id === design.headingCase);
  if (hc) style["--hcase"] = hc.value;
  const ht = HEADING_TRACKING.find((x) => x.id === design.headingTracking);
  if (ht) style["--htrack"] = ht.value;
  if (layout.textScale) style["--ts"] = layout.textScale;
  if (layout.motionSpeed) style["--spd"] = layout.motionSpeed;
  const secR = sectionRadius(design.buttonShape);
  if (secR) style["--sec-r"] = secR;

  const ctx: RenderCtx = {
    t: strings(lang),
    pageId: trackPageId,
    hrefs,
    card: r.card,
    buttonFx: r.buttonFx,
    buttonIdle: r.buttonIdle,
    iconFx: r.iconFx,
    iconIdle: r.iconIdle,
    buttonShape: layout.buttonShape,
    buttonSize: layout.buttonSize,
  };

  const pageReveal = design.reveal ?? "rise";
  const pageSection = design.section && design.section !== "none" ? design.section : undefined;
  const intro = embedded ? "none" : (design.intro ?? "aura");
  const fixedLayers = !embedded;

  const renderBlock = (block: Block) => {
    const box = block.box && block.box !== "inherit" ? block.box : BARE.includes(block.type) ? undefined : pageSection;
    const reveal = block.anim ?? pageReveal;
    return (
      <div
        key={block.id}
        data-block-id={editable ? block.id : undefined}
        className={cn(editable && selectedId === block.id && "is-selected")}
      >
        <div className={cn(reveal !== "none" && `rv rv-${reveal}`, box && box !== "none" && `sec sec-${box}`)}>
          <BlockView block={block} ctx={ctx} />
        </div>
      </div>
    );
  };

  const stagger = cn(
    "aura-stagger flex flex-col",
    intro === "aura" && "aura-stagger-intro",
    intro === "fade" && "aura-stagger-fade",
    layout.spacing,
  );

  const badge = !hideBadge && (
    <Link
      href="/"
      dir="ltr"
      className="mt-6 flex items-center justify-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text"
    >
      <AuraMark className="h-3.5 w-3.5 text-primary" />
      Made with <span className="font-display font-medium">AURA</span>
    </Link>
  );

  let body_: React.ReactNode;
  const pageLayout = design.layout ?? "stack";
  if (pageLayout === "split") {
    const heroIdx = content.blocks.findIndex((b) => b.type === "hero");
    const hero = heroIdx >= 0 ? content.blocks[heroIdx] : undefined;
    const rest = content.blocks.filter((_, i) => i !== heroIdx);
    body_ = (
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-14">
        <div className="pg-split-grid gap-y-8">
          {hero && <aside className="pg-split-aside mx-auto w-full max-w-md">{renderBlock(hero)}</aside>}
          <main className={cn(stagger, "mx-auto w-full max-w-xl")}>{rest.map(renderBlock)}</main>
        </div>
        {badge}
      </div>
    );
  } else if (pageLayout === "card") {
    body_ = (
      <div className={cn("relative z-10 mx-auto w-full px-3.5 pt-10 pb-12", layout.contentWidth)}>
        <div className={cn("pg-card", stagger)}>{content.blocks.map(renderBlock)}</div>
        {badge}
      </div>
    );
  } else {
    body_ = (
      <div className={cn("relative z-10 mx-auto w-full px-5 py-14", layout.contentWidth)}>
        <div className={stagger}>{content.blocks.map(renderBlock)}</div>
        {badge}
      </div>
    );
  }

  const paletteKey = `${design.accent ?? ""}|${bg.light}`;
  // Only this page's fonts — one small stylesheet, hoisted into <head> and
  // de-duplicated by React (many pages on one screen share it).
  const fontsLink = fontsHref([design.font, design.headingFont]);

  return (
    <div
      dir={dir}
      lang={lang === "he" ? "he" : undefined}
      data-tfx={design.titleFx && design.titleFx !== "none" ? design.titleFx : undefined}
      style={style as React.CSSProperties}
      className={cn(
        // overflow-clip, not hidden: hidden would make this a scroll container
        // and break the sticky profile column of the split layout.
        "pg relative flex flex-col overflow-clip text-text",
        !bg.css && "aura-backdrop",
        design.bgAnimate && !bg.image && "bg-pan",
        embedded ? "min-h-full" : "min-h-screen",
        editable && "pg-editable",
      )}
    >
      {fontsLink && (
        <>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href={fontsLink} precedence="fonts" />
        </>
      )}
      {bg.image && (
        <div aria-hidden className={cn("pointer-events-none inset-0", fixedLayers ? "fixed" : "absolute")}>
          <div
            className="pg-photo"
            style={{
              backgroundImage: `url("${bg.image.url}")`,
              filter: bg.image.blur ? `blur(${bg.image.blur}px)` : undefined,
            }}
          />
          <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${bg.image.dim / 100})` }} />
        </div>
      )}
      {intro !== "none" && <PageIntro bg={bg.css} variant={intro} />}
      {!thumbnail && design.liveBg && design.liveBg !== "none" && (
        <LiveBackground key={`${design.liveBg}|${paletteKey}`} variant={design.liveBg} fixed={fixedLayers} />
      )}
      {design.bgFx && INTERACTIVE_BG_FX.has(design.bgFx) ? (
        !thumbnail &&
        <CursorFx variant={design.bgFx as "cursorglow" | "cursorgrid" | "cursorspot"} />
      ) : (
        r.bgFx && <div className={cn("pointer-events-none absolute inset-0", r.bgFx)} aria-hidden />
      )}
      {body_}
      {!thumbnail && design.fab && <FloatingButton fab={design.fab} hrefs={hrefs} embedded={embedded} />}
      {!embedded && design.cursor && design.cursor !== "none" && <CustomCursor variant={design.cursor} />}
      {trackPageId && <ViewBeacon pageId={trackPageId} />}
    </div>
  );
}
