"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ADMIN_COOKIE, adminToken, codeMatches, isAdminUnlocked } from "@/lib/admin-gate";
import { paypalConfigured } from "@/lib/paypal";
import { asPlan } from "@/lib/plans";
import { revalidateUser } from "@/lib/public-page";
import { beforeAccountDelete } from "@/lib/account-cleanup";

async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  // Server actions are callable without the layout, so the second factor is
  // checked here too.
  if (!(await isAdminUnlocked())) redirect("/admin");
  return user;
}

export type UnlockState = { error?: string } | undefined;

/** Verify the admin panel code and set the unlock cookie. Admins only. */
export async function unlockAdminAction(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  const entered = String(formData.get("code") ?? "").trim();
  if (!codeMatches(entered)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "קוד שגוי" };
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect("/admin");
}

export async function suspendUser(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) return;
  await prisma.user.update({ where: { id }, data: { status: "SUSPENDED" } });
  await revalidateUser(id);
  revalidatePath("/admin/users");
}

export async function activateUser(id: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
  await revalidateUser(id);
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) return;
  const gone = await prisma.user.findUnique({ where: { id }, select: { username: true } });
  await beforeAccountDelete(id);
  await revalidateUser(id);
  await prisma.user.delete({ where: { id } });
  if (gone) await revalidateUser(id, [gone.username]);
  revalidatePath("/admin/users");
}

export async function setUserPlan(id: string, formData: FormData) {
  await requireAdmin();
  const next = asPlan(String(formData.get("plan") ?? ""));
  // An admin-set plan is a deliberate grant: it never runs out on its own.
  await prisma.$executeRaw`UPDATE "User" SET plan = ${next}, "planExpiresAt" = NULL WHERE id = ${id}`;
  await revalidateUser(id);
  revalidatePath("/admin/users");
}

/**
 * End early access: every paid plan that was claimed for free (no PayPal
 * subscription, no end date yet) gets an end date `days` from now. Until then
 * nothing changes; afterwards those users fall back to Free unless they
 * subscribe. Only possible once payments are live — otherwise people would
 * just claim the plan again.
 */
export async function endEarlyAccess(formData: FormData) {
  await requireAdmin();
  if (!paypalConfigured()) return;
  const days = Math.min(90, Math.max(1, Math.round(Number(formData.get("days")) || 14)));
  const until = new Date(Date.now() + days * 86_400_000).toISOString();
  await prisma.$executeRaw`
    UPDATE "User" SET "planExpiresAt" = ${until}
    WHERE plan <> 'FREE' AND "paypalSubId" IS NULL AND "planExpiresAt" IS NULL
  `;
  revalidatePath("/admin");
}
