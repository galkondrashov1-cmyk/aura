import Link from "next/link";
import { AuraLogo } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
      <Link href="/">
        <AuraLogo />
      </Link>
      <nav className="flex items-center gap-1.5 sm:gap-2">
        <Link href="/pricing" className={buttonClasses("ghost", "sm", "px-3 max-[359px]:hidden sm:px-4")}>
          Pricing
        </Link>
        <Link href="/login" className={buttonClasses("ghost", "sm", "px-3 sm:px-4")}>
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
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/pricing" className={buttonClasses("ghost", "sm")}>
            Pricing
          </Link>
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
