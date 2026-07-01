"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps a premium control. When `locked`, the children are dimmed and any
 * interaction routes to the Upgrade page instead of doing the action.
 */
export function PlanLock({
  locked,
  tier = "Plus",
  className,
  children,
}: {
  locked: boolean;
  tier?: "Plus" | "Pro";
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  if (!locked) return <>{children}</>;
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none opacity-45 select-none">{children}</div>
      <button
        type="button"
        onClick={() => router.push("/dashboard/upgrade")}
        aria-label={`Upgrade to ${tier} to unlock`}
        className="absolute inset-0 grid place-items-center rounded-xl bg-bg/35 transition-colors hover:bg-bg/20"
      >
        <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text shadow">
          <Lock className="h-3 w-3 text-primary" /> {tier}
        </span>
      </button>
    </div>
  );
}

/** Small inline "Plus"/"Pro" pill for section headers. */
export function PlanPill({ tier = "Plus" }: { tier?: "Plus" | "Pro" }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
      <Lock className="h-2.5 w-2.5" /> {tier}
    </span>
  );
}
