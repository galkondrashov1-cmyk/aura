import { getSession } from "@/lib/session";
import { getEffectivePlan } from "@/lib/plan-source";
import { paypalConfigured } from "@/lib/paypal";
import { UpgradePlans, type PaypalPublicConfig } from "@/components/upgrade/plans";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const user = await getSession();
  const current = user ? await getEffectivePlan(user.id) : "FREE";
  const changed = (await searchParams)?.changed === "1";
  const paypal: PaypalPublicConfig | undefined =
    paypalConfigured() && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      ? {
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          plans: {
            PLUS: {
              monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_MONTHLY!,
              yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_YEARLY!,
            },
            PRO: {
              monthly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY!,
              yearly: process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY!,
            },
          },
        }
      : undefined;

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-medium tracking-tight">Upgrade</h1>
        <p className="mt-1 text-sm text-text-muted">
          {paypal
            ? "Subscribe with PayPal — cancel anytime, and you keep access until the end of what you paid for."
            : "Every plan is free while we're in early access. Pick one to unlock its features now, no card required."}
        </p>
      </div>
      {changed && (
        <p className="mt-4 inline-block rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary">
          Plan updated. Your new features are unlocked.
        </p>
      )}
      <div className="mt-8">
        <UpgradePlans current={current} paypal={paypal} />
      </div>
    </div>
  );
}
