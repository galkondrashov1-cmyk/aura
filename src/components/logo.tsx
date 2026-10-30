import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Brand-neutral mark: a solid square in the accent color. */
export function Mark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2.5 shrink-0 bg-primary", className)} />;
}

/** The wordmark is set from BRAND.name, so renaming the product needs no artwork. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Mark />
      <span dir="ltr" className="font-display text-[1.35rem] leading-none font-bold tracking-tight text-text">
        {BRAND.name}
      </span>
    </span>
  );
}
