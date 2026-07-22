import { cn } from "@/lib/utils";

/** The "Aura field" mark — three radiating rings around a core, matching the
    app icon. Uses currentColor; `aura-mark` adds the icon's neon bloom. */
export function AuraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("aura-mark h-7 w-7", className)}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
      <circle cx="24" cy="24" r="14.5" stroke="currentColor" strokeWidth="1.7" opacity="0.8" />
      <circle cx="24" cy="24" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="24" cy="24" r="2.8" fill="currentColor" />
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
