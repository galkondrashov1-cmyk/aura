"use client";

import { useTransition } from "react";
import { setPlan } from "@/lib/actions/plan";
import type { Plan } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function PlanButton({
  plan,
  isCurrent,
  popular,
}: {
  plan: Plan;
  isCurrent: boolean;
  popular: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={isCurrent || pending}
      onClick={() => startTransition(() => setPlan(plan))}
      className={cn(
        "mt-6 rounded-xl px-4 py-3 text-sm font-bold transition cursor-pointer disabled:cursor-default",
        isCurrent
          ? "bg-white/5 text-ink-2"
          : popular
            ? "bg-halo text-night hover:bg-halo-2"
            : "border border-line text-ink hover:bg-white/5",
      )}
    >
      {pending ? "רגע…" : isCurrent ? "החבילה הנוכחית" : "מעבר לחבילה (דמו)"}
    </button>
  );
}
