import { cn } from "@/lib/utils";

/** The "Aura field" mark — concentric radiating rings. Uses currentColor. */
export function AuraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-7 w-7", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="24" r="13" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <circle cx="24" cy="24" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function AuraLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <AuraMark className="h-7 w-7 text-primary" />
      <span className="font-display text-lg font-medium tracking-tight text-text">
        AURA
      </span>
    </span>
  );
}
