"use client";

import { useTransition } from "react";
import { deleteBusiness, setBusinessPlan, setBusinessStatus } from "@/lib/actions/admin";
import type { Plan } from "@/lib/plans";
import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export type AdminBusinessView = {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  slug: string;
  plan: string;
  role: string;
  status: string;
  published: boolean;
  appointments: number;
  visits: number;
  createdAt: string;
};

const PLAN_LABEL: Record<string, string> = { FREE: "חינם", DESIGN: "עיצוב", BUSINESS: "עסקים" };

export function BusinessTable({ businesses }: { businesses: AdminBusinessView[] }) {
  if (businesses.length === 0) {
    return <div className="card p-10 text-center text-sm text-ink-2">לא נמצאו עסקים.</div>;
  }
  return (
    <div className="flex flex-col gap-2.5">
      {businesses.map((b) => (
        <BusinessRow key={b.id} b={b} />
      ))}
    </div>
  );
}

function BusinessRow({ b }: { b: AdminBusinessView }) {
  const [pending, startTransition] = useTransition();
  const suspended = b.status === "SUSPENDED";

  return (
    <div className={cn("card flex flex-wrap items-center justify-between gap-3 p-4", suspended && "opacity-60")}>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2 font-bold">
          {b.name}
          {b.role === "ADMIN" && <Badge tone="violet">אדמין</Badge>}
          {suspended && <Badge tone="red">מושעה</Badge>}
          {b.published ? <Badge tone="green">באוויר</Badge> : <Badge tone="gray">טיוטה</Badge>}
        </p>
        <p className="mt-0.5 text-xs text-ink-2">
          {b.ownerName} · <span dir="ltr">{b.email}</span> ·{" "}
          <a href={`/${b.slug}`} target="_blank" rel="noopener noreferrer" className="text-halo hover:underline" dir="ltr">
            /{b.slug}
          </a>
        </p>
        <p className="mt-0.5 text-[11px] text-ink-2/70">
          {b.appointments} תורים · {b.visits} צפיות · נרשם {new Date(b.createdAt).toLocaleDateString("he-IL")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={b.plan}
          disabled={pending}
          onChange={(e) => startTransition(() => setBusinessPlan(b.id, e.target.value as Plan))}
          className="rounded-lg border border-line bg-night-3 px-2.5 py-1.5 text-xs font-semibold text-ink outline-none cursor-pointer"
        >
          {Object.entries(PLAN_LABEL).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>

        {b.role !== "ADMIN" && (
          <>
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => setBusinessStatus(b.id, suspended ? "ACTIVE" : "SUSPENDED"))
              }
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer disabled:opacity-50",
                suspended ? "bg-mint/15 text-mint hover:bg-mint/25" : "bg-yellow-500/12 text-yellow-500 hover:bg-yellow-500/20",
              )}
            >
              {suspended ? "החזרה לפעילות" : "השעיה"}
            </button>
            <button
              disabled={pending}
              onClick={() => {
                if (confirm(`למחוק את «${b.name}» לצמיתות? כל העמודים והתורים יימחקו.`)) {
                  startTransition(() => deleteBusiness(b.id));
                }
              }}
              className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 transition hover:bg-red-500/20 cursor-pointer disabled:opacity-50"
            >
              מחיקה
            </button>
          </>
        )}
      </div>
    </div>
  );
}
