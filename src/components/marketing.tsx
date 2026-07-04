import Link from "next/link";
import { AuraLogo } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

/* Feature rows — each one shows the actual product idea visually instead of
   a generic icon grid. */
export function FeatureRows() {
  return (
    <section className="mx-auto max-w-6xl space-y-16 px-6 py-16">
      <FeatureRow
        title="A real design studio, not a settings page"
        body="18 complete themes, animated backgrounds, buttons with actual character — sticker, ticket, neon, liquid. Change everything, or let one tap style the whole page."
        visual={<ThemeStrip />}
      />
      <FeatureRow
        flip
        title="Every block moves the way you want"
        body="Give each block its own motion — a floating button here, glowing icons there, a countdown to your next drop. Your page, your rhythm."
        visual={<MotionMock />}
      />
      <FeatureRow
        title="Know what's working"
        body="Views, clicks and top links, built in. See which link your audience actually taps — no third-party trackers, no setup."
        visual={<StatsMock />}
      />
    </section>
  );
}

function FeatureRow({
  title,
  body,
  visual,
  flip,
}: {
  title: string;
  body: string;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className={cn("grid items-center gap-8 md:grid-cols-2", flip && "md:[&>*:first-child]:order-2")}>
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-md text-text-muted">{body}</p>
      </div>
      <div className="rounded-3xl border border-border bg-surface p-5">{visual}</div>
    </div>
  );
}

function ThemeStrip() {
  const themes = [
    ["Emerald Night", "radial-gradient(at 20% 0%, hsl(158 75% 20%) 0, transparent 50%), #05060a", "#00E5A0"],
    ["Synth Retro", "linear-gradient(180deg, hsl(255 60% 8%), hsl(316 70% 14%))", "#F472B6"],
    ["Royal Gold", "radial-gradient(60% 50% at 50% 0%, hsl(268 55% 20%), transparent 55%), hsl(264 45% 7%)", "#FBBF24"],
    ["Candy Pop", "linear-gradient(160deg, hsl(85 70% 90%), hsl(205 70% 86%))", "#EC4899"],
    ["Ocean Deep", "linear-gradient(160deg, hsl(197 55% 8%), hsl(217 60% 16%))", "#38BDF8"],
    ["Foil Noir", "repeating-linear-gradient(115deg, hsl(300 55% 16%) 0 8%, hsl(345 55% 22%) 12%, hsl(60 55% 16%) 20%, hsl(140 55% 22%) 28%, hsl(300 55% 16%) 36%)", "#E5E7EB"],
  ] as const;
  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map(([name, bg, accent]) => (
        <div key={name} className="overflow-hidden rounded-xl border border-border">
          <div className="h-16" style={{ background: bg }} />
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
            <span className="truncate text-[10px] text-text-muted">{name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MotionMock() {
  return (
    <div className="space-y-2.5">
      <div className="bi-float aura-glow flex h-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-ink">
        Floating button
      </div>
      <div className="flex h-11 items-center justify-center rounded-full border border-border bg-surface-2 text-sm text-text">
        <span className="bh-glitch">Glitch on hover</span>
      </div>
      <div className="grid grid-cols-4 gap-2" aria-hidden>
        {["07", "14", "32", "55"].map((v, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface-2 py-2 text-center">
            <p className="font-display text-lg font-medium text-primary tabular-nums">{v}</p>
            <p className="text-[9px] tracking-wide text-text-muted uppercase">
              {["Days", "Hours", "Min", "Sec"][i]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsMock() {
  const bars = [34, 51, 42, 66, 58, 80, 74];
  return (
    <div>
      <div className="flex items-end gap-2">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${h * 0.9}px` }} />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {[
          ["Book a free session", "62%"],
          ["My program", "27%"],
        ].map(([label, pct]) => (
          <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs">
            <span className="text-text-muted">{label}</span>
            <span className="text-primary">{pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", title: "Claim your name", body: "useaura.me/you — takes about ten seconds, and it's yours." },
  { n: "02", title: "Make it unmistakably yours", body: "Pick a theme, tune every block, watch it change live as you type." },
  { n: "03", title: "Share one link everywhere", body: "Bio, stories, email signature — and watch the clicks roll in." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
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

export function CtaBand() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="aura-glow rounded-3xl border border-border bg-surface px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Your name is still available. Probably.
        </h2>
        <p className="mt-3 text-text-muted">
          Claim useaura.me/you before someone with the same name does.
        </p>
        <div className="mt-8">
          <Link href="/signup" className={buttonClasses("primary", "lg")}>
            Create your AURA — free
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
        <div>
          <AuraLogo />
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            Built by a tiny team that sweats the details — every theme in AURA is
            hand-tuned, not generated.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonClasses("ghost", "sm")}>
            Log in
          </Link>
          <Link href="/signup" className={buttonClasses("primary", "sm")}>
            Create your AURA
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-10 text-xs text-text-muted">
        © {new Date().getFullYear()} AURA · useaura.me
      </div>
    </footer>
  );
}
