"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { getSubscription, planFromPaypalPlanId, paypalConfigured } from "@/lib/paypal";

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
