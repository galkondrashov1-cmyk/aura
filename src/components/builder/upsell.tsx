"use client";

import { BRAND } from "@/lib/brand";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { claimPlan } from "@/lib/actions/plan";
import { formatPrice, planInfo, PLAN_RANK, type Plan } from "@/lib/plans";
import type { LockedFeature } from "@/lib/studio";
import { cn } from "@/lib/utils";

/**
 * The in-editor upgrade sheet. Shows exactly what the plan adds (and, when
 * publishing, which premium touches the live page would skip). During early
 * access it unlocks instantly without leaving the editor; once payments are
 * on it hands off to the Upgrade page in a new tab.
 */
export function Upsell({
  tier,
  plan,
  payments,
  locked,
  mode,
  onClose,
  onPublishAnyway,
  onUnlocked,
}: {
  tier: Plan;
  plan: Plan;
  /** PayPal is configured — paid plans must be bought, not claimed. */
  payments: boolean;
  locked: LockedFeature[];
  mode: "unlock" | "publish";
  onClose: () => void;
  onPublishAnyway?: () => void;
  onUnlocked?: () => void;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  // Ask for the plan that covers everything the page uses.
  const target = locked.reduce<Plan>((t, f) => (PLAN_RANK[f.tier] > PLAN_RANK[t] ? f.tier : t), tier);
  const info = planInfo(target);
  const relevant = locked.filter((f) => PLAN_RANK[f.tier] > PLAN_RANK[plan]);

  const unlock = () =>
    start(async () => {
      setError("");
      const res = await claimPlan(target);
      if (!res.ok) {
        if (res.needsPayment) window.open("/dashboard/upgrade", "_blank");
        else setError(res.error);
        return;
      }
      router.refresh();
      onUnlocked?.();
      onClose();
    });

  return (
    <div className="fixed inset-0 z-[95] grid place-items-end bg-black/60 backdrop-blur-sm sm:place-items-center sm:p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="publish-pop relative w-full max-w-md overflow-hidden rounded-t-xl border border-border bg-bg p-6 shadow-2xl sm:rounded-xl"
      >
        <button onClick={onClose} aria-label="סגירה" className="absolute top-4 end-4 text-text-muted hover:text-text">
          <X className="h-5 w-5" />
        </button>

        <p className="relative flex items-center gap-2 text-xs font-medium tracking-wide uppercase" style={{ color: "var(--ink-soft)" }}>
          <Sparkles className="h-3.5 w-3.5" /> {BRAND.name} {info.name}
        </p>
        <h2 className="relative mt-1.5 font-display text-xl font-medium">
          {mode === "publish" ? `חלק מהנגיעות דורשות ${info.name}` : info.tagline}
        </h2>

        {relevant.length > 0 && (
          <div className="relative mt-3 rounded-lg border border-border bg-surface-2/60 p-3">
            <p className="text-xs text-text-muted">
              {mode === "publish" ? "העמוד החי ידלג על:" : "כבר בעמוד שלכם, מחכים לעלות לאוויר:"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {relevant.slice(0, 10).map((f) => (
                <span key={f.label} className="rounded-full bg-bg px-2.5 py-1 text-[11px] text-text">
                  {f.label}
                </span>
              ))}
              {relevant.length > 10 && <span className="px-1 py-1 text-[11px] text-text-muted">ועוד {relevant.length - 10}</span>}
            </div>
          </div>
        )}

        <ul className="relative mt-4 space-y-2">
          {info.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--ink-soft)" }} />
              {h}
            </li>
          ))}
        </ul>

        <div className="relative mt-5 rounded-lg border border-border p-3 text-sm">
          {payments ? (
            <p className="text-text">
              {formatPrice(info.yearlyPerMonth)}
              <span className="text-text-muted"> לחודש בחיוב שנתי · או {formatPrice(info.monthly)} בחודשי</span>
            </p>
          ) : (
            <p className="text-text">
              <span className="font-medium" style={{ color: "var(--ink-soft)" }}>
                בחינם בגישה המוקדמת.
              </span>{" "}
              <span className="text-text-muted">
                בהמשך {formatPrice(info.yearlyPerMonth)} לחודש (בחיוב שנתי). לא תחויבו אף פעם אלא אם תירשמו למנוי בעצמכם.
              </span>
            </p>
          )}
        </div>

        {error && <p className="relative mt-3 text-sm text-red-400">{error}</p>}

        <div className="relative mt-5 flex flex-col gap-2">
          <button
            onClick={unlock}
            disabled={pending}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium text-[#04120c] transition hover:brightness-110 disabled:opacity-60",
            )}
            style={{ background: "var(--primary)" }}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {payments ? `לשדרוג ל־${info.name}` : `${info.name} בחינם`}
            {mode === "publish" && !payments ? " ופרסום" : ""}
          </button>
          {mode === "publish" && onPublishAnyway ? (
            <button onClick={onPublishAnyway} className="h-10 rounded-full text-sm text-text-muted hover:text-text">
              לפרסם בלעדיהן
            </button>
          ) : (
            <a href="/pricing" target="_blank" rel="noopener noreferrer" className="h-10 text-center text-sm leading-10 text-text-muted hover:text-text">
              להשוואת כל החבילות
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
