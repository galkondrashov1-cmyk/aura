"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession, createSession, sessionOf } from "@/lib/session";
import { asPlan, type Plan } from "@/lib/plans";

// DEMO billing: "upgrading" just flips the plan. A real payment provider
// (PayPal / Stripe / Grow) slots in here later without touching callers.
export async function setPlan(plan: Plan) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const biz = await prisma.business.update({
    where: { id: session.id },
    data: { plan: asPlan(plan) },
  });
  await createSession(sessionOf(biz));
  revalidatePath("/dashboard");
  revalidatePath(`/${biz.slug}`);
}
