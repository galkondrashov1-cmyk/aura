"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ADMIN_GATE_COOKIE, adminCode, requireAdmin } from "@/lib/admin";
import { asPlan, type Plan } from "@/lib/plans";

export type GateState = { error?: string } | null;

/** Step 2 of admin login: the access code (on top of a normal admin session). */
export async function adminGateAction(_prev: GateState, formData: FormData): Promise<GateState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    select: { role: true },
  });
  if (biz?.role !== "ADMIN") redirect("/dashboard");

  const code = String(formData.get("code") ?? "").trim();
  if (code !== adminCode()) {
    return { error: "קוד גישה שגוי" };
  }
  const jar = await cookies();
  jar.set(ADMIN_GATE_COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12, // re-enter the code every 12h
  });
  redirect("/admin");
}

export async function setBusinessPlan(businessId: string, plan: Plan) {
  await requireAdmin();
  await prisma.business.update({
    where: { id: businessId },
    data: { plan: asPlan(plan) },
  });
  revalidatePath("/admin");
}

export async function setBusinessStatus(businessId: string, status: "ACTIVE" | "SUSPENDED") {
  const adminId = await requireAdmin();
  if (businessId === adminId && status === "SUSPENDED") {
    throw new Error("אי אפשר להשעות את עצמך");
  }
  await prisma.business.update({
    where: { id: businessId },
    data: { status },
  });
  revalidatePath("/admin");
}

export async function deleteBusiness(businessId: string) {
  const adminId = await requireAdmin();
  if (businessId === adminId) throw new Error("אי אפשר למחוק את עצמך");
  await prisma.business.delete({ where: { id: businessId } });
  revalidatePath("/admin");
}
