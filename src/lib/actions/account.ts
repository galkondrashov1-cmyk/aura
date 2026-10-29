"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { RESERVED_USERNAMES as RESERVED } from "@/lib/reserved";
import { revalidateUser } from "@/lib/public-page";
import { revalidatePath } from "next/cache";
import { destroySession } from "@/lib/session";
import { clear, hit, limited } from "@/lib/rate-limit";
import { beforeAccountDelete } from "@/lib/account-cleanup";

export type SettingsState = { ok?: boolean; error?: string; values?: Record<string, string> } | undefined;

/** Password re-checks are rate limited too — a borrowed session can't brute-force them. */
async function passwordOk(userId: string, password: string): Promise<boolean | "limited"> {
  const key = `pw:${userId}`;
  if (await limited(key, 8, 15 * 60_000)) return "limited";
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  const ok = Boolean(user?.passwordHash && (await bcrypt.compare(password, user.passwordHash)));
  if (ok) await clear(key);
  else await hit(key);
  return ok;
}


async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

const profileSchema = z.object({
  name: z.string().trim().max(60).optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Use only lowercase letters, numbers, and underscores"),
});

export async function updateProfileAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await requireUser();
  const values = {
    name: String(formData.get("name") ?? "").slice(0, 60),
    username: String(formData.get("username") ?? "").slice(0, 40),
  };
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input", values };
  }
  const { name, username } = parsed.data;
  if (RESERVED.has(username)) return { error: "That username is reserved", values };

  if (username !== session.username) {
    const taken = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (taken && taken.id !== session.id) return { error: "That username is taken", values };
  }

  const user = await prisma.user.update({
    where: { id: session.id },
    data: { name: name || null, username },
  });
  await createSession({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    plan: session.plan,
  });
  // The old address must stop serving the cached page.
  if (username !== session.username) await revalidateUser(user.id, [session.username]);
  revalidatePath("/dashboard", "layout");
  return { ok: true, values: { name: user.name ?? "", username: user.username } };
}

const passwordSchema = z.object({
  current: z.string().min(1, "Enter your current password"),
  next: z.string().min(8, "New password must be at least 8 characters"),
});

export async function changePasswordAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const session = await requireUser();
  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const ok = await passwordOk(session.id, parsed.data.current);
  if (ok === "limited") return { error: "Too many attempts — try again in 15 minutes." };
  if (!ok) return { error: "Current password is incorrect" };

  await prisma.user.update({
    where: { id: session.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });
  // Every other device is signed out; this one gets a fresh session.
  await createSession(session);
  return { ok: true };
}

/**
 * Delete the account and everything in it (pages, uploads, form entries,
 * analytics). Stops any PayPal billing first so nobody pays for a ghost.
 */
export async function deleteAccountAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await requireUser();
  if (String(formData.get("confirm") ?? "").trim().toLowerCase() !== session.username) {
    return { error: `Type ${session.username} to confirm.` };
  }
  const ok = await passwordOk(session.id, String(formData.get("password") ?? ""));
  if (ok === "limited") return { error: "Too many attempts — try again in 15 minutes." };
  if (!ok) return { error: "Password is incorrect" };

  await beforeAccountDelete(session.id);
  // Mark every public URL stale while the pages still exist to enumerate.
  await revalidateUser(session.id);
  await prisma.user.delete({ where: { id: session.id } });
  await destroySession();
  redirect("/");
}
