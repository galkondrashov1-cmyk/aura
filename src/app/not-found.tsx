import Link from "next/link";
import { AuraLogo } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="aura-backdrop flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <AuraLogo />
      <div>
        <h1 className="font-display text-3xl font-medium tracking-tight">
          This page has no aura
        </h1>
        <p className="mt-2 text-text-muted">
          It doesn&apos;t exist, or it hasn&apos;t been published yet.
        </p>
      </div>
      <Link href="/" className={buttonClasses("primary", "md")}>
        Back home
      </Link>
    </div>
  );
}
