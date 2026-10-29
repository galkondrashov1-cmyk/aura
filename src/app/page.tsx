import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Zap,
  Languages,
  LayoutTemplate,
  BarChart3,
  Inbox,
  MousePointer2,
  Check,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { SiteNav, HowItWorks, CtaBand, Footer } from "@/components/marketing";
import { Showcase } from "@/components/marketing/showcase";
import { PageRenderer } from "@/components/renderer/page-renderer";
import { templateContent } from "@/lib/templates";
import { TITLE_FX } from "@/lib/studio";
import { FONTS } from "@/lib/fonts";
import { PLANS } from "@/lib/plans";
import type { PageContent, PageDesign } from "@/lib/blocks";

// Static marketing page: rendered once at build time, served from the CDN.
export const dynamic = "force-static";

function Phone({ content, className }: { content: PageContent; className?: string }) {
  return (
    <div data-mode="vivid" className={className}>
      <div className="pointer-events-none flex min-h-[1180px] w-[390px] origin-top-left scale-[0.728] flex-col select-none *:flex-1">
        <PageRenderer content={content} embedded thumbnail hideBadge />
      </div>
    </div>
  );
}

const SHOWCASE = [
  { id: "creator", name: "Creator" },
  { id: "portfolio", name: "Portfolio" },
  { id: "cafe", name: "Café" },
  { id: "coach", name: "Coach" },
  { id: "musician", name: "Musician" },
  { id: "hebrew", name: "עברית" },
];

// Same words, four different Remix results — hand-picked so the page is stable.
const REMIX_LOOKS: Partial<PageDesign>[] = [
  { accent: "#F472B6", bgCustom: { type: "mesh", colors: ["#5b21b6", "#9d174d", "#1e1b4b"] }, titleFx: "aurora", headingFont: "syne", font: "inter", headingWeight: "bold", card: "glass-frost", buttonShape: "pill", section: "none" },
  { accent: "#FBBF24", bgCustom: { type: "linear", colors: ["#1c1917", "#422006"], angle: 160 }, titleFx: "chrome", headingFont: "playfair", font: "dmsans", card: "solid-deep", buttonShape: "soft", section: "glass" },
  { accent: "#22D3EE", bgCustom: { type: "radial", colors: ["#083344", "#020617"] }, titleFx: "neon", headingFont: "grotesk", font: "grotesk", headingCase: "upper", headingTracking: "wide", card: "neon-cyber", buttonShape: "sharp", section: "none" },
  { accent: "#B45309", bgCustom: { type: "linear", colors: ["#fdf6ec", "#f1e4cf"], angle: 160 }, titleFx: "highlight", headingFont: "fraunces", font: "outfit", headingWeight: "semibold", card: "solid-surface", buttonShape: "rounded", section: "solid" },
];

const remixContent = (design: Partial<PageDesign>): PageContent => ({
  design: { reveal: "none", ...design },
  blocks: [
    { id: "h", type: "hero", name: "Noa Levi", tagline: "Photographer · Tel Aviv", badge: "Booking 2027" },
    { id: "l", type: "links", items: [
      { label: "Book a shoot", url: "#", highlighted: true, icon: "📸" },
      { label: "Portfolio", url: "#", icon: "auto" },
    ] },
    { id: "s", type: "socials", iconStyle: "chip", items: [
      { platform: "instagram", url: "#" },
      { platform: "tiktok", url: "#" },
      { platform: "whatsapp", url: "#" },
    ] },
  ],
});

const FEATURES = [
  { icon: Wand2, title: "Remix", body: "One tap generates a complete, coherent look — palette, fonts, buttons, motion. Tap again. And again." },
  { icon: Sparkles, title: "Live backgrounds", body: "Real-time WebGL liquid mesh and silk, constellations that follow the cursor, fireflies, hyperspace." },
  { icon: LayoutTemplate, title: "Real layouts", body: "Floating card, split screen, cover headers, poster type — a landing page, not just a list of links." },
  { icon: Inbox, title: "Business blocks", body: "Pricing, testimonials, stats that count up, maps with Waze, newsletter & contact forms with an inbox." },
  { icon: Languages, title: "עברית, from day one", body: "Ten Hebrew fonts and automatic right-to-left pages — your visitors' UI text switches to Hebrew too." },
  { icon: MousePointer2, title: "Motion with taste", body: "Scroll-driven reveals, typewriter intros, custom cursors and a floating WhatsApp button." },
  { icon: BarChart3, title: "Analytics that matter", body: "Views, clicks, click-rate per link, where visitors come from and their countries — bots excluded." },
  { icon: Zap, title: "Instant pages", body: "Published pages are pre-rendered and served from the edge. Heavy effects load only when they're used." },
];

export default function Home() {
  const slides = SHOWCASE.map((s) => ({
    id: s.id,
    name: s.name,
    node: <Phone content={templateContent(s.id)} className="h-full w-full overflow-hidden" />,
  }));

  return (
    <div className="min-h-screen overflow-x-clip">
      <div className="aura-backdrop">
        <SiteNav />

        <main className="mx-auto max-w-6xl px-6">
          <section className="grid items-center gap-14 pt-10 pb-16 md:pt-16 lg:grid-cols-[1.1fr_1fr]">
            <div className="text-center lg:text-left">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-text-muted">
                <span className="aura-glow h-1.5 w-1.5 rounded-full bg-primary" />
                Early access — every plan is free while we grow
              </span>

              <h1 className="font-display text-4xl leading-[1.04] font-medium tracking-tight md:text-6xl">
                A page that looks like{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(100deg, var(--primary), var(--accent))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  nobody else&apos;s.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base text-text-muted md:text-lg lg:mx-0">
                AURA is a design studio in your pocket. Templates that are real landing pages, live animated
                backgrounds, {TITLE_FX.length - 1} title effects, {FONTS.length} fonts (Hebrew included) — and Remix, which
                invents a brand-new look every time you tap it.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/signup" className={buttonClasses("primary", "lg")}>
                  Claim your page
                </Link>
                <p className="text-sm text-text-muted">
                  useaura.me/<span className="text-text">yourname</span> · no card, no code
                </p>
              </div>
            </div>

            <Showcase slides={slides} />
          </section>
        </main>
      </div>

      {/* Same words, infinite looks */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Remix</p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight md:text-4xl">Same words. Infinite looks.</h2>
          <p className="mt-3 text-text-muted">
            These four pages have identical content. Each look is one tap of Remix — every color, font and button
            stays fully editable afterwards.
          </p>
        </div>
        <div className="mt-10 flex gap-4 overflow-x-auto px-1 pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:justify-items-center md:overflow-visible">
          {REMIX_LOOKS.map((d, i) => (
            <div
              key={i}
              className="h-[420px] w-[226px] shrink-0 overflow-hidden rounded-[30px] border-[6px] border-[#1a1d24] shadow-2xl ring-1 ring-white/10"
              style={{ transform: `rotate(${[-2, 1.5, -1, 2][i]}deg)` }}
            >
              <div data-mode="vivid" className="h-full w-full overflow-hidden">
                <div className="pointer-events-none flex min-h-[760px] w-[390px] origin-top-left scale-[0.55] flex-col select-none *:flex-1">
                  <PageRenderer content={remixContent(d)} embedded thumbnail hideBadge />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Title effects, rendered for real */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">Headlines with personality</h2>
        <p className="mt-3 max-w-xl text-text-muted">
          {TITLE_FX.length - 1} title effects. These are live — the same CSS your page ships with.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TITLE_FX.filter((f) => f.id !== "none").map((f, i) => (
            <div
              key={f.id}
              data-tfx={f.id}
              className="flex h-28 flex-col items-center justify-center rounded-2xl border border-border bg-surface"
              style={{ ["--primary" as string]: ["#00E5A0", "#F472B6", "#38BDF8", "#FBBF24", "#A78BFA", "#FB7185"][i % 6] }}
            >
              <span className="pg-title [--h1:2rem]">
                <span className="tfx" data-text="Aura">
                  Aura
                </span>
              </span>
              <span className="mt-2 text-[11px] text-text-muted">{f.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">Everything a landing page needs</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/12 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-medium">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">Less than a coffee a month</h2>
        <p className="mt-3 text-text-muted">Free while we&apos;re in early access. Prices below are what paid plans will cost, billed yearly.</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.id} className={`rounded-3xl border bg-surface p-6 ${p.popular ? "aura-glow border-primary/50" : "border-border"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-medium">{p.name}</h3>
                <p className="font-display text-2xl font-medium">
                  {p.yearlyPerMonth === 0 ? "Free" : `$${p.yearlyPerMonth}`}
                  {p.yearlyPerMonth > 0 && <span className="text-sm text-text-muted">/mo</span>}
                </p>
              </div>
              <p className="mt-1 text-sm text-text-muted">{p.tagline}</p>
              <ul className="mt-5 space-y-2">
                {p.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
      <Footer />
    </div>
  );
}
