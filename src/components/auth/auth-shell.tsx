import Link from "next/link";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/brand";

/** Every auth screen: the form on paper, a typographic ink panel beside it. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <Link href="/" aria-label={BRAND.name} className="self-start">
          <Logo />
        </Link>
        <div className="m-auto w-full max-w-sm py-12">
          <h1 className="font-display text-[2.6rem] leading-none font-black tracking-tight">{title}</h1>
          <p className="mt-3 mb-8 text-text-muted">{subtitle}</p>
          {children}
          {footer && (
            <div className="mt-6 border-t border-border pt-5 text-sm text-text-muted [&_a]:text-text [&_a]:underline">{footer}</div>
          )}
        </div>
      </div>
      <aside className="hidden flex-col justify-between bg-text p-12 text-bg lg:flex">
        <span className="size-3 bg-primary" />
        <p className="display-xl">
          עמוד אחד.
          <br />
          בדיוק כמוכם.
        </p>
        <p dir="ltr" className="text-end text-sm text-bg/50">
          {BRAND.domain}
        </p>
      </aside>
    </div>
  );
}
