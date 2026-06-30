"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ADMIN_COOKIE, adminCode } from "@/lib/admin-gate";

async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export type UnlockState = { error?: string } | undefined;

/** Verify the admin panel code and set the unlock cookie. Admins only. */
export async function unlockAdminAction(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  await requireAdmin();
  const entered = String(formData.get("code") ?? "").trim();
  if (entered !== adminCode()) return { error: "Incorrect code" };
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, entered, {
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
  revalidatePath("/admin/users");
}

export async function activateUser(id: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();
  if (admin.id === id) return;
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
