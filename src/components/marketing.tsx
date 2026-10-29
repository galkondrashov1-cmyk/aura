import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="border-b border-text">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label={BRAND.name}>
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/pricing" className={buttonClasses("ghost", "sm", "max-[359px]:hidden")}>
            מחירים
          </Link>
          <Link href="/login" className={buttonClasses("ghost", "sm")}>
            התחברות
          </Link>
          <Link href="/signup" className={buttonClasses("primary", "sm")}>
            <span className="sm:hidden">הרשמה</span>
            <span className="hidden sm:inline">צרו עמוד משלכם</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** "domain/____" field that carries the chosen name straight into signup. */
export function ClaimField({ tone = "light" }: { tone?: "light" | "accent" }) {
  return (
    <form action="/signup" className="flex flex-col gap-2 sm:flex-row">
      <label
        dir="ltr"
        className={
          "flex h-14 flex-1 items-center rounded-[4px] border px-4 text-lg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text " +
          (tone === "accent" ? "border-text bg-bg" : "border-text bg-surface")
        }
      >
        <span className="text-text-muted">{BRAND.domain}/</span>
        <input
          name="u"
          aria-label="השם שתרצו"
          placeholder="noa"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={20}
          size={1}
          pattern="[a-zA-Z0-9_]{3,20}"
          title="3–20 אותיות באנגלית, ספרות או _"
          className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-text-muted/50"
        />
      </label>
      <button type="submit" className={buttonClasses(tone === "accent" ? "secondary" : "primary", "lg", tone === "accent" ? "bg-bg" : "")}>
        תפסו את השם
      </button>
    </form>
  );
}

export function CtaBand() {
  return (
    <section className="bg-primary text-primary-ink">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:items-end">
        <h2 className="display-xl wipe-in lg:col-span-7">השם שלכם עוד פנוי. כנראה.</h2>
        <div className="lg:col-span-5">
          <p className="mb-4 text-lg">
            תפסו את <span dir="ltr">{BRAND.domain}/noa</span> לפני שמישהו עם אותו שם יקדים אתכם.
          </p>
          <ClaimField tone="accent" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 sm:px-8">
        <p dir="ltr" className="text-end font-display text-[clamp(4rem,18vw,15rem)] leading-[0.8] font-black tracking-tight">
          {BRAND.name}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-text pt-6 text-sm text-text-muted">
          <p>נבנה על ידי צוות קטן שמת על הפרטים. כל ערכת עיצוב כאן כוונה ביד.</p>
          <nav className="flex gap-5">
            <Link href="/pricing" className="hover:text-text">
              מחירים
            </Link>
            <Link href="/login" className="hover:text-text">
              התחברות
            </Link>
            <Link href="/signup" className="hover:text-text">
              הרשמה
            </Link>
          </nav>
          <p dir="ltr">
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </p>
        </div>
      </div>
    </footer>
  );
}
