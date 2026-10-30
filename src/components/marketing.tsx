import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/logo";
import { buttonClasses } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
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
            <span className="hidden sm:inline">צרו עמוד בחינם</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

/** "domain/____" field that carries the chosen name straight into signup. */
export function ClaimField() {
  return (
    <form action="/signup" className="flex flex-col gap-2 sm:flex-row">
      <label
        dir="ltr"
        className="flex h-13 flex-1 items-center rounded-lg border border-border bg-surface px-4 text-[1.05rem] focus-within:border-text-muted"
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
          className="min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-text-muted/60"
        />
      </label>
      <button type="submit" className={buttonClasses("primary", "lg", "h-13 rounded-lg")}>
        תפסו את השם
      </button>
    </form>
  );
}

export function CtaBand() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="display-l">תפסו את השם שלכם</h2>
          <p className="mt-3 text-text-muted">
            כתובת קצרה כמו <span dir="ltr">{BRAND.domain}/noa</span>, לביו, לסטורי ולכרטיס הביקור.
          </p>
        </div>
        <ClaimField />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-text-muted sm:px-8">
        <Logo />
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
          © {new Date().getFullYear()} {BRAND.name}
        </p>
      </div>
    </footer>
  );
}
