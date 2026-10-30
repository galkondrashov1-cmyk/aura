import Link from "next/link";
import { Logo } from "@/components/logo";
import { BRAND } from "@/lib/brand";
import { Phone } from "@/components/marketing/phone";
import { templateContent } from "@/lib/templates";

/** Every auth screen: the form, and beside it a real page made with the product. */
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
      <div className="flex min-w-0 flex-col px-5 py-6 sm:px-10">
        <Link href="/" aria-label={BRAND.name} className="self-start">
          <Logo />
        </Link>
        <div className="m-auto w-full max-w-sm py-12">
          <h1 className="text-[2rem] leading-tight font-semibold">{title}</h1>
          <p className="mt-3 mb-8 text-text-muted">{subtitle}</p>
          {children}
          {footer && (
            <div className="mt-6 border-t border-border pt-5 text-sm text-text-muted [&_a]:text-text [&_a]:underline">{footer}</div>
          )}
        </div>
      </div>
      <aside className="hidden flex-col items-center justify-center gap-5 border-s border-border bg-surface p-12 lg:flex">
        <Phone content={templateContent("hebrew")} />
        <p className="text-sm text-text-muted">עמוד לדוגמה מתוך התבניות</p>
      </aside>
    </div>
  );
}
