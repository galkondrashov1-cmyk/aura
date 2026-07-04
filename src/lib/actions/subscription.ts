"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import {
  getSubscription,
  planFromPaypalPlanId,
  paypalConfigured,
  cancelSubscription,
} from "@/lib/paypal";

export type ActivateState = { error?: string } | undefined;

/**
 * Called after PayPal onApprove with the new subscription id. The server
 * re-verifies the subscription with PayPal (status + plan) before granting
 * anything — the client is never trusted.
 */
export async function activateSubscription(
  _prev: ActivateState,
  formData: FormData,
): Promise<ActivateState> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!paypalConfigured()) return { error: "Payments aren't enabled yet." };

  const subId = String(formData.get("subscriptionId") ?? "").trim();
  if (!/^[A-Z0-9-]{10,30}$/i.test(subId)) return { error: "Invalid subscription." };

  let sub;
  try {
    sub = await getSubscription(subId);
  } catch {
    return { error: "Could not verify the subscription with PayPal." };
  }
  if (!["ACTIVE", "APPROVED"].includes(sub.status)) {
    return { error: `Subscription is ${sub.status.toLowerCase()} — payment not completed.` };
  }
  const plan = planFromPaypalPlanId(sub.plan_id);
  if (!plan) return { error: "Unknown PayPal plan." };

  await prisma.$executeRaw`UPDATE "User" SET plan = ${plan}, "paypalSubId" = ${subId}, "planExpiresAt" = NULL WHERE id = ${user.id}`;
  await createSession({ ...user, plan });
  redirect("/dashboard/upgrade?changed=1");
}

/**
 * Cancel the current user's PayPal subscription. Access continues until the
 * end of the period already paid for (PayPal's next_billing_time), then the
 * plan lazily downgrades to FREE. Never charges again after this.
 */
export async function cancelSubscriptionAction() {
  const user = await getSession();
  if (!user) redirect("/login");

  const rows = await prisma.$queryRaw<{ paypalSubId: string | null }[]>`
    SELECT "paypalSubId" FROM "User" WHERE id = ${user.id} LIMIT 1
  `;
  const subId = rows[0]?.paypalSubId;
  if (!subId || !paypalConfigured()) redirect("/dashboard/upgrade");

  // Paid-through date BEFORE cancelling (next_billing_time may clear after).
  let expires = new Date().toISOString();
  try {
    const sub = await getSubscription(subId);
    if (sub.billing_info?.next_billing_time) expires = sub.billing_info.next_billing_time;
  } catch {
    /* fall back to immediate expiry */
  }
  await cancelSubscription(subId, "User cancelled from the AURA dashboard");
  await prisma.$executeRaw`UPDATE "User" SET "planExpiresAt" = ${expires} WHERE id = ${user.id}`;

  redirect("/dashboard/upgrade?cancelled=1");
}
