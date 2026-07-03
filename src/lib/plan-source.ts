import { prisma } from "@/lib/prisma";
import { asPlan, type Plan } from "@/lib/plans";

/**
 * Authoritative plan for a user, straight from the DB (the JWT can lag).
 * A plan with a past `planExpiresAt` (set when a subscription is cancelled,
 * suspended or payment fails) counts as FREE — and is lazily downgraded.
 */
export async function getEffectivePlan(userId: string): Promise<Plan> {
  const rows = await prisma.$queryRaw<
    { plan: string | null; planExpiresAt: string | null }[]
  >`SELECT plan, "planExpiresAt" FROM "User" WHERE id = ${userId} LIMIT 1`;
  const row = rows[0];
  if (!row) return "FREE";
  const plan = asPlan(row.plan);
  if (plan !== "FREE" && row.planExpiresAt) {
    const exp = Date.parse(row.planExpiresAt);
    if (!Number.isNaN(exp) && exp < Date.now()) {
      await prisma.$executeRaw`UPDATE "User" SET plan = 'FREE', "paypalSubId" = NULL, "planExpiresAt" = NULL WHERE id = ${userId}`;
      return "FREE";
    }
  }
  return plan;
}
