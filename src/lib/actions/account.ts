"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";

export type SettingsState = { ok?: boolean; error?: string } | undefined;

const RESERVED = new Set([
  "login",
  "signup",
  "dashboard",
  "admin",
  "api",
  "examples",
  "settings",
  "about",
  "terms",
  "privacy",
]);

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
  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { name, username } = parsed.data;
  if (RESERVED.has(username)) return { error: "That username is reserved" };

  if (username !== session.username) {
    const taken = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    if (taken && taken.id !== session.id) return { error: "That username is taken" };
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
  });
  return { ok: true };
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

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (
    !user?.passwordHash ||
    !(await bcrypt.compare(parsed.data.current, user.passwordHash))
  ) {
    return { error: "Current password is incorrect" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });
  return { ok: true };
}
