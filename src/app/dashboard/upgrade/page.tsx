import { getSession } from "@/lib/session";
import { effectivePlanFrom } from "@/lib/plan-source";
import { caps, planInfo } from "@/lib/plans";
import { paypalConfigured } from "@/lib/paypal";
import { UpgradePlans, type PaypalPublicConfig } from "@/components/upgrade/plans";
import { PlanComparison, PricingFaq } from "@/components/upgrade/comparison";

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string; cancelled?: string; limit?: string; error?: string }>;
}) {
  const user = await getSession();
  const current = user ? effectivePlanFrom(user) : "FREE";
  const sp = await searchParams;
  const changed = sp?.changed === "1";
  const cancelled = sp?.cancelled === "1";
  const pageLimit = sp?.limit === "pages" ? caps(current).maxPages : null;
  const errorText =
    sp?.error === "subscription"
      ? "בטלו קודם את המנוי (בכרטיס של החבילה החינמית) — הגישה נשמרת עד סוף התקופה ששולמה."
      : sp?.error === "payment"
        ? "חבילות בתשלום דורשות מנוי — השתמשו בכפתור PayPal בחבילה שתרצו."
        : null;
  const hasSubscription = Boolean(user?.paypalSubId);
  const accessUntil = user?.planExpiresAt ?? null;
  const paypal: PaypalPublicConfig | undefined =
    user && paypalConfigured() && process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      ? {
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          customId: user.id,
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
        <h1 className="font-display text-[2rem] leading-tight font-bold tracking-tight">שדרוג</h1>
        <p className="mt-1 text-sm text-text-muted">
          {paypal
            ? "מנוי דרך PayPal — ביטול בכל עת, והגישה נשמרת עד סוף התקופה ששולמה."
            : "בתקופת הגישה המוקדמת כל החבילות בחינם. בחרו אחת ותקבלו את היכולות שלה מיד, בלי כרטיס אשראי."}
        </p>
      </div>
      {errorText && (
        <p className="mt-4 inline-block rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm text-red-400">{errorText}</p>
      )}
      {pageLimit !== null && (
        <p className="mt-4 inline-block rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary-text">
          {pageLimit === 1 ? `בחבילת ${planInfo(current).name} יש עמוד אחד` : `בחבילת ${planInfo(current).name} יש ${pageLimit} עמודים`} — וכולם
          בשימוש. בחרו חבילה גדולה יותר, או מחקו עמוד שאתם לא צריכים.
        </p>
      )}
      {changed && (
        <p className="mt-4 inline-block rounded-xl border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-primary-text">
          {current === "FREE"
            ? "עברתם לחבילה החינמית. שום דבר לא נמחק — נגיעות הפרימיום מוסתרות עד שתשדרגו שוב."
            : `אתם ב־${planInfo(current).name}. היכולות החדשות פתוחות.`}
        </p>
      )}
      {cancelled && (
        <p className="mt-4 inline-block rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text-muted">
          המנוי בוטל. הגישה נשמרת עד סוף התקופה ששולמה — ולא תחויבו שוב.
        </p>
      )}
      <div className="mt-8">
        <UpgradePlans
          current={current}
          paypal={paypal}
          hasSubscription={hasSubscription}
          accessUntil={accessUntil}
        />
      </div>
      <h2 className="mt-14 font-display text-xl font-medium tracking-tight">הכל, זה לצד זה</h2>
      <p className="mt-1 text-sm text-text-muted">
        כל אפקט עובד בעורך בכל חבילה — העמוד החי מציג את מה שכלול בחבילה שלכם.
      </p>
      <div className="mt-5">
        <PlanComparison highlight={current} />
      </div>
      <h2 className="mt-14 font-display text-xl font-medium tracking-tight">שאלות נפוצות</h2>
      <div className="mt-5 max-w-3xl">
        <PricingFaq />
      </div>
    </div>
  );
}
