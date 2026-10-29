"use server";

import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { asPlan, type Plan } from "@/lib/plans";
import { paypalConfigured } from "@/lib/paypal";
import { revalidateUser } from "@/lib/public-page";

export type ClaimResult =
  | { ok: true }
  | { ok: false; error: string; code: "login" | "payment" | "subscription"; needsPayment?: boolean };

/**
 * Switch the current user's plan during early access (no payment). Once real
 * payments are enabled, paid tiers can ONLY be granted through a verified
 * PayPal subscription (activateSubscription) — otherwise this would be a free
 * backdoor callable outside the UI. Raw SQL keeps it working whether the
 * generated client knows the `plan` column yet or not.
 */
export async function claimPlan(plan: Plan): Promise<ClaimResult> {
  const user = await getSession();
  if (!user) return { ok: false, error: "Please log in again.", code: "login" };
  const next = asPlan(plan);
  if (paypalConfigured() && next !== "FREE") {
    return { ok: false, error: "Paid plans need a subscription.", code: "payment", needsPayment: true };
  }
  const rows = await prisma.$queryRaw<{ paypalSubId: string | null; planExpiresAt: string | null }[]>`
    SELECT "paypalSubId", "planExpiresAt" FROM "User" WHERE id = ${user.id} LIMIT 1
  `;
  const row = rows[0];
  // Never leave someone paying for a plan they no longer have.
  if (next === "FREE" && row?.paypalSubId && !row.planExpiresAt) {
    return {
      ok: false,
      error: "Cancel your subscription first — you keep access until the end of what you paid for.",
      code: "subscription",
    };
  }
  // A lapsed end date would instantly cancel the claim; a future one stays.
  const expired = row?.planExpiresAt ? Date.parse(row.planExpiresAt) < Date.now() : false;
  if (expired) {
    await prisma.$executeRaw`UPDATE "User" SET plan = ${next}, "paypalSubId" = NULL, "planExpiresAt" = NULL WHERE id = ${user.id}`;
  } else {
    await prisma.$executeRaw`UPDATE "User" SET plan = ${next} WHERE id = ${user.id}`;
  }
  await revalidateUser(user.id);
  await createSession({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    plan: next,
  });
  return { ok: true };
}
