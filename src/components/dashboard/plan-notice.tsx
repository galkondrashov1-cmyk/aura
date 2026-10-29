import Link from "next/link";
import { Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { asPlan, planInfo } from "@/lib/plans";

/** Whole days left until `iso`, or null once it has passed. */
function daysLeft(iso: string): number | null {
  const ms = Date.parse(iso) - Date.now();
  return Number.isNaN(ms) || ms < 0 ? null : Math.max(1, Math.ceil(ms / 86_400_000));
}

/**
 * Tells people well in advance when their paid plan is about to end — the
 * end of early access, or a cancelled subscription running out.
 */
export async function PlanNotice({ userId }: { userId: string }) {
  const rows = await prisma.$queryRaw<{ plan: string; paypalSubId: string | null; planExpiresAt: string | null }[]>`
    SELECT plan, "paypalSubId", "planExpiresAt" FROM "User" WHERE id = ${userId} LIMIT 1
  `;
  const row = rows[0];
  const plan = asPlan(row?.plan);
  if (!row?.planExpiresAt || plan === "FREE") return null;
  const days = daysLeft(row.planExpiresAt);
  if (days === null) return null;
  const date = new Date(row.planExpiresAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  const name = planInfo(plan).name;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
      <Clock className="h-4 w-4 shrink-0 text-primary" />
      <p className="min-w-0 flex-1">
        {row.paypalSubId ? `Your ${name} plan ends on ${date}` : `Early access to ${name} ends on ${date}`}{" "}
        <span className="text-text-muted">
          ({days} day{days === 1 ? "" : "s"}). After that your page moves to Free — nothing is deleted.
        </span>
      </p>
      <Link href="/dashboard/upgrade" className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-ink">
        Keep {name}
      </Link>
    </div>
  );
}
