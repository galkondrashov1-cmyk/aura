"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { asPlan, type Plan } from "@/lib/plans";
import { paypalConfigured } from "@/lib/paypal";

/**
 * Switch the current user's plan. Free for now — no payment. Re-issues the
 * session so plan-gated features unlock immediately. Raw SQL keeps it working
 * whether the generated client knows the `plan` column yet or not.
 */
export async function upgradeAction(plan: Plan) {
  const user = await getSession();
  if (!user) redirect("/login");
  const next = asPlan(plan);

  // Once real payments are enabled, paid tiers can ONLY be granted through a
  // verified PayPal subscription (activateSubscription) — this action would
  // otherwise be a free backdoor callable outside the UI.
  if (paypalConfigured() && next !== "FREE") {
    redirect("/dashboard/upgrade");
  }

  await prisma.$executeRaw`UPDATE "User" SET plan = ${next} WHERE id = ${user.id}`;

  await createSession({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    plan: next,
  });

  redirect("/dashboard/upgrade?changed=1");
}
