"use client";

import { setUserPlan } from "@/lib/actions/admin";

const PLANS = ["FREE", "PLUS", "PRO"] as const;

export function PlanSelect({ userId, plan }: { userId: string; plan: string }) {
  return (
    <form action={setUserPlan.bind(null, userId)}>
      <select
        name="plan"
        defaultValue={plan}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-xs text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-label="User plan"
      >
        {PLANS.map((p) => (
          <option key={p} value={p}>
            {p[0] + p.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
    </form>
  );
}
