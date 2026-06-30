"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS, monthlyPrice, type Plan } from "@/lib/plans";
import { upgradeAction } from "@/lib/actions/plan";

export function UpgradePlans({ current }: { current: Plan }) {
  const [billing, setBilling] = useState<"yearly" | "monthly">("yearly");

  return (
    <div>
      {/* Billing toggle */}
      <div className="mb-7 inline-flex items-center rounded-full border border-border bg-surface-2 p-1 text-sm">
        {(["yearly", "monthly"] as const).map((b) => (
          <button
            key={b}
            onClick={() => setBilling(b)}
            className={cn(
              "rounded-full px-4 py-1.5 capitalize transition-colors",
              billing === b ? "bg-surface text-text" : "text-text-muted hover:text-text",
            )}
          >
            {b}
            {b === "yearly" && (
              <span className="ml-1.5 text-xs text-primary">save 20%</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = current === p.id;
          const perMonth =
            billing === "yearly" ? p.yearlyPerMonth : monthlyPrice(p.yearlyPerMonth);
          return (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-surface p-6",
                p.popular ? "border-primary/50" : "border-border",
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-ink">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: p.accent }}
                />
                <h3 className="font-display text-lg font-medium">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm text-text-muted">{p.tagline}</p>

              <div className="mt-5">
                {p.yearlyPerMonth === 0 ? (
                  <p className="font-display text-2xl font-medium">Free</p>
                ) : (
                  <>
                    <p className="text-xs font-medium tracking-wide text-primary uppercase">
                      Free for now
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      soon{" "}
                      <span className="font-display text-xl font-medium text-text">
                        ${perMonth.toFixed(2)}
                      </span>
                      /mo
                      <span className="ml-1 text-xs">
                        billed {billing === "yearly" ? "yearly" : "monthly"}
                      </span>
                    </p>
                  </>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-full border border-border py-2.5 text-sm text-text-muted"
                  >
                    Current plan
                  </button>
                ) : (
                  <form action={upgradeAction.bind(null, p.id)}>
                    <button
                      type="submit"
                      className={cn(
                        "w-full rounded-full py-2.5 text-sm font-medium transition-colors",
                        p.popular || p.id === "PRO"
                          ? "aura-glow bg-primary text-primary-ink hover:brightness-110"
                          : "border border-border text-text hover:bg-surface-2",
                      )}
                    >
                      {p.id === "FREE" ? "Switch to Free" : `Get ${p.name} free`}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
