"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { asPlan, type Plan } from "@/lib/plans";

/**
 * Switch the current user's plan. Free for now — no payment. Re-issues the
 * session so plan-gated features unlock immediately. Raw SQL keeps it working
 * whether the generated client knows the `plan` column yet or not.
 */
export async function upgradeAction(plan: Plan) {
  const user = await getSession();
  if (!user) redirect("/login");
  const next = asPlan(plan);

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
