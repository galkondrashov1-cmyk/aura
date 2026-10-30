"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS, formatPrice, type Plan } from "@/lib/plans";
import { claimPlan } from "@/lib/actions/plan";
import { cancelSubscriptionAction } from "@/lib/actions/subscription";
import { PayPalSubscribe } from "./paypal-button";

export type PaypalPublicConfig = {
  clientId: string;
  /** The signed-in user's id — stamped on the subscription as custom_id. */
  customId: string;
  plans: { PLUS: { monthly: string; yearly: string }; PRO: { monthly: string; yearly: string } };
};

const SAVING = Math.round(
  Math.max(...PLANS.filter((p) => p.monthly > 0).map((p) => (1 - p.yearlyPerMonth / p.monthly) * 100)),
);

/**
 * The three plan cards with a yearly/monthly toggle. "public" (pricing page,
 * homepage) sends people to sign up; "dashboard" switches plans — free during
 * early access, through PayPal once payments are on.
 */
export function UpgradePlans({
  mode = "dashboard",
  current,
  paypal,
  hasSubscription = false,
  accessUntil,
}: {
  mode?: "public" | "dashboard";
  current?: Plan;
  paypal?: PaypalPublicConfig;
  hasSubscription?: boolean;
  accessUntil?: string | null;
}) {
  const [billing, setBilling] = useState<"yearly" | "monthly">("yearly");
  const earlyAccess = !paypal;
  // Being billed right now (a cancelled subscription has an end date).
  const billed = hasSubscription && !accessUntil;
  const until = accessUntil ? new Date(accessUntil).toLocaleDateString("he-IL") : "";

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-border bg-surface-2 p-1 text-sm">
          {(["yearly", "monthly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                billing === b ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text",
              )}
            >
              {b === "yearly" ? "שנתי" : "חודשי"}
              {b === "yearly" && <span className="ms-1.5 text-xs text-primary-text">חיסכון {SAVING}%</span>}
            </button>
          ))}
        </div>
        {earlyAccess && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary-text">
            <Sparkles className="h-3.5 w-3.5" /> גישה מוקדמת — כל החבילות בחינם עכשיו
          </span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = mode === "dashboard" && current === p.id;
          const perMonth = billing === "yearly" ? p.yearlyPerMonth : p.monthly;
          return (
            <div
              key={p.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-surface p-6",
                p.popular ? "border-primary/50" : "border-border",
              )}
            >
              {p.popular && (
                <span className="absolute -top-3 start-6 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-ink">
                  <Sparkles className="h-3 w-3" /> הכי פופולרי
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.accent }} />
                <h3 className="font-display text-lg font-medium">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm text-text-muted">{p.tagline}</p>
              <p className="mt-0.5 text-xs text-text-muted">מתאים ל: {p.forWho}</p>

              <div className="mt-5 min-h-[4.25rem]">
                {p.yearlyPerMonth === 0 ? (
                  <>
                    <p className="font-display text-3xl font-medium">{formatPrice(0).replace(".00", "")}</p>
                    <p className="text-xs text-text-muted">לתמיד</p>
                  </>
                ) : (
                  <>
                    <p className="flex items-baseline gap-1.5">
                      <span className={cn("font-display text-3xl font-medium", earlyAccess && "text-text-muted line-through decoration-primary/70 decoration-2")}>
                        {formatPrice(perMonth)}
                      </span>
                      <span className="text-sm text-text-muted">לחודש</span>
                      {earlyAccess && <span className="ms-1 font-display text-xl font-medium text-primary-text">{formatPrice(0).replace(".00", "")}</span>}
                    </p>
                    <p className="text-xs text-text-muted">
                      {earlyAccess ? "בחינם בגישה המוקדמת · בהמשך " : ""}
                      {billing === "yearly" ? `בחיוב שנתי (${formatPrice(p.yearlyPerMonth * 12)} לשנה)` : "בחיוב חודשי, ביטול בכל עת"}
                    </p>
                  </>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {p.highlights.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
                    <span className="text-text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {mode === "public" ? (
                  <Link
                    href="/signup"
                    className={cn(
                      "flex w-full items-center justify-center rounded-full py-2.5 text-sm font-medium transition-colors",
                      p.popular ? "bg-primary text-primary-ink hover:brightness-110" : "border border-border text-text hover:bg-surface-2",
                    )}
                  >
                    {p.id === "FREE" ? "התחילו בחינם" : earlyAccess ? `${p.name} בחינם` : `להתחיל עם ${p.name}`}
                  </Link>
                ) : isCurrent && paypal && p.id !== "FREE" && !billed ? (
                  // Early-access or cancelled plan running out: subscribe to keep it.
                  <div>
                    <PayPalSubscribe clientId={paypal.clientId} planId={paypal.plans[p.id as "PLUS" | "PRO"][billing]} customId={paypal.customId} />
                    <p className="mt-2 text-center text-xs text-text-muted">
                      החבילה הנוכחית שלכם{until ? ` — ${hasSubscription ? "שולמה" : "גישה מוקדמת"} עד ${until}` : ""}. הירשמו כדי להישאר בה.
                    </p>
                  </div>
                ) : isCurrent ? (
                  <div className="text-center">
                    <button disabled className="w-full rounded-full border border-border py-2.5 text-sm text-text-muted">
                      החבילה הנוכחית שלכם
                    </button>
                    {until && p.id !== "FREE" && (
                      <p className="mt-2 text-xs text-text-muted">
                        {hasSubscription ? "בוטל — גישה" : "גישה מוקדמת"} עד {until}
                      </p>
                    )}
                  </div>
                ) : p.id === "FREE" && billed ? (
                  <form
                    action={cancelSubscriptionAction}
                    onSubmit={(e) => {
                      if (
                        !confirm(
                          "לבטל את המנוי? הגישה נשמרת עד סוף התקופה ששולמה, ולא תחויבו שוב.",
                        )
                      )
                        e.preventDefault();
                    }}
                  >
                    <button type="submit" className="w-full rounded-full border border-border py-2.5 text-sm text-text-muted transition-colors hover:text-red-400">
                      ביטול מנוי
                    </button>
                  </form>
                ) : p.id === "FREE" && paypal && until ? (
                  <button disabled className="w-full rounded-full border border-border py-2.5 text-sm text-text-muted opacity-60">
                    יתחיל כשהחבילה הנוכחית תסתיים
                  </button>
                ) : paypal && p.id !== "FREE" ? (
                  <div>
                    <PayPalSubscribe clientId={paypal.clientId} planId={paypal.plans[p.id as "PLUS" | "PRO"][billing]} customId={paypal.customId} />
                    {billed && (
                      <p className="mt-2 text-center text-xs text-text-muted">המנוי הנוכחי יבוטל אוטומטית כשתעברו.</p>
                    )}
                  </div>
                ) : (
                  <ClaimButton plan={p.id} label={p.id === "FREE" ? "מעבר לחינם" : `${p.name} בחינם`} primary={p.id !== "FREE"} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Switches plan during early access, then shows the result on this page. */
function ClaimButton({ plan, label, primary }: { plan: Plan; label: string; primary: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await claimPlan(plan);
          if (!res.ok && res.code === "login") return router.push("/login");
          router.replace(res.ok ? "/dashboard/upgrade?changed=1" : `/dashboard/upgrade?error=${res.code}`);
          router.refresh();
        })
      }
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors disabled:opacity-60",
        primary ? "bg-primary text-primary-ink hover:brightness-110" : "border border-border text-text hover:bg-surface-2",
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}
