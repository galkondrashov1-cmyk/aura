import Link from "next/link";
import {
  Wand2,
  SlidersHorizontal,
  Palette,
  BarChart3,
  Link2,
  Globe,
} from "lucide-react";
import { AuraLogo } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/">
        <AuraLogo />
      </Link>
      <nav className="flex items-center gap-1.5 sm:gap-2">
        <Link href="/login" className={buttonClasses("ghost", "sm")}>
          Log in
        </Link>
        <Link href="/signup" className={buttonClasses("primary", "sm")}>
          <span className="sm:hidden">Sign up</span>
          <span className="hidden sm:inline">Create your AURA</span>
        </Link>
      </nav>
    </header>
  );
}

const FEATURES = [
  { icon: Palette, title: "Visual builder", body: "Add, reorder, and restyle blocks with a true-to-life live preview." },
  { icon: SlidersHorizontal, title: "Total customization", body: "Backgrounds, fonts, button shapes, spacing, and motion — tune every detail." },
  { icon: Link2, title: "Dynamic link cards", body: "Turn a pasted URL into a rich, styled card — not a boring button." },
  { icon: BarChart3, title: "Built-in analytics", body: "See views, clicks, top links, and devices, all in one place." },
  { icon: Wand2, title: "One-click theming", body: "Match your accent color to any background instantly with the design studio." },
  { icon: Globe, title: "Your own URL", body: "Claim useaura.me/you and share one beautiful link everywhere." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Everything you need to stand out
        </h2>
        <p className="mt-3 text-text-muted">
          A real page builder — not a list of links. Built for creators,
          founders, and anyone with something to share.
        </p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-medium">{title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Create your page", body: "Start fresh and add the blocks you need — links, socials, text, and more." },
  { n: "02", title: "Make it yours", body: "Edit blocks, colors, and links with a live preview as you go." },
  { n: "03", title: "Publish & share", body: "Go live at useaura.me/you and watch the analytics roll in." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
        Live in three steps
      </h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="font-display text-3xl font-medium text-primary">{s.n}</div>
            <h3 className="mt-3 font-display text-lg font-medium">{s.title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { quote: "I replaced my whole link-in-bio in an afternoon and it finally looks like my brand.", name: "Ava Chen", role: "Illustrator" },
  { quote: "The builder is the first one that didn't fight me. The live preview is everything.", name: "Marcus Bell", role: "Founder" },
  { quote: "Analytics + a real page in one place. My booking link clicks doubled.", name: "Priya N.", role: "Coach" },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
        Built for people with something to share
      </h2>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-border bg-surface p-6">
            <blockquote className="text-sm leading-relaxed text-text">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-xs text-primary">
                {t.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="aura-glow rounded-3xl border border-border bg-surface px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Ready to build your aura?
        </h2>
        <p className="mt-3 text-text-muted">
          Free, no code, live in minutes.
        </p>
        <div className="mt-8">
          <Link href="/signup" className={buttonClasses("primary", "lg")}>
            Create your AURA
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    { title: "Product", links: [["Sign up", "/signup"], ["Log in", "/login"]] },
    { title: "Company", links: [["About", "#"], ["Blog", "#"], ["Careers", "#"]] },
    { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"]] },
  ] as const;

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <AuraLogo />
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            The most beautiful way to build a personal page.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-medium">{col.title}</p>
            <ul className="mt-3 space-y-2">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-text-muted transition-colors hover:text-text">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-text-muted">
        © {new Date().getFullYear()} AURA · useaura.me
      </div>
    </footer>
  );
}
