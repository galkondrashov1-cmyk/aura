import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan } from "@/lib/plans";
import { PLANS, priceLabel } from "@/lib/plans";
import { PlanButton } from "@/components/plan-button";

export const metadata: Metadata = { title: "החבילה שלי" };

export default async function PlanPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({ where: { id: session.id } });
  if (!biz) redirect("/login");
  const current = asPlan(biz.plan);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold">החבילה שלי</h1>
        <p className="mt-1 text-sm text-ink-2">
          מצב דמו — שדרוג והחזרה פועלים מיד וללא חיוב אמיתי. חיבור סליקה יגיע בהמשך.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = p.id === current;
          return (
            <div
              key={p.id}
              className={`card relative flex flex-col p-6 ${isCurrent ? "border-halo/60" : ""}`}
            >
              {isCurrent && (
                <span className="absolute -top-3 right-5 rounded-full bg-halo px-3 py-1 text-xs font-bold text-night">
                  החבילה שלך
                </span>
              )}
              <h3 className="text-lg font-extrabold" style={{ color: p.accent }}>
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-ink-2">{p.tagline}</p>
              <div className="mt-4 text-2xl font-extrabold">
                {p.monthly === 0 ? "₪0" : `₪${p.monthly.toFixed(2)}`}
                {p.monthly > 0 && <span className="text-sm font-medium text-ink-2"> / חודש</span>}
              </div>
              <p className="mt-0.5 text-xs text-ink-2">{priceLabel(p)}</p>
              <ul className="mt-5 flex flex-1 flex-col gap-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.accent }} />
                    {f}
                  </li>
                ))}
              </ul>
              <PlanButton plan={p.id} isCurrent={isCurrent} popular={!!p.popular} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
