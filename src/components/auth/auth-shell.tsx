import Link from "next/link";
import { AuraLogo } from "@/components/aura-logo";

/** The centered card every auth screen shares. */
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
    <div className="aura-backdrop flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <Link href="/" className="mb-8">
        <AuraLogo />
      </Link>
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 sm:p-7">
        <h1 className="font-display text-2xl font-medium tracking-tight">{title}</h1>
        <p className="mt-1 mb-6 text-sm text-text-muted">{subtitle}</p>
        {children}
        {footer && <div className="mt-5 text-center text-sm text-text-muted [&_a]:underline">{footer}</div>}
      </div>
    </div>
  );
}
