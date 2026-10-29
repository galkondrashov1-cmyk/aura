"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { asPlan } from "@/lib/plans";
import { RESERVED_USERNAMES as RESERVED } from "@/lib/reserved";
import { clear, clientIp, hit, limited } from "@/lib/rate-limit";
import { emailConfigured, sendEmail } from "@/lib/email";
import { resetLink, verifyReset } from "@/lib/reset-token";

/** `values` refills the form after an error (React resets it on submit). */
export type AuthState = { error?: string; values?: Record<string, string> } | undefined;

const MINUTE = 60_000;
// Compared against when the email is unknown, so both paths take as long.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.1zG2Jp8b9yQ8G7Fh2l1aTo7wJ2Ra";


const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be 20 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Use only lowercase letters, numbers, and underscores"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

// One-time bootstrap: the email in ADMIN_BOOTSTRAP_EMAIL is auto-promoted to
// ADMIN on its next login/signup. Lets the owner self-promote without DB access.
async function maybePromote(user: {
  id: string;
  email: string;
  role: string;
}): Promise<string> {
  const boot = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  if (boot && user.email.toLowerCase() === boot && user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
    return "ADMIN";
  }
  return user.role;
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const values = {
    username: String(formData.get("username") ?? "").slice(0, 40),
    email: String(formData.get("email") ?? "").slice(0, 160),
  };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input", values };
  }
  const { username, email, password } = parsed.data;

  if (RESERVED.has(username)) {
    return { error: "That username is reserved", values };
  }

  const ipKey = `signup:${await clientIp()}`;
  if (await limited(ipKey, 8, 60 * MINUTE)) {
    return { error: "Too many new accounts from your network — try again in an hour.", values };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
  if (existing?.email === email) return { error: "That email is already in use — log in instead?", values };
  if (existing?.username === username) return { error: "That username is taken", values };
  await hit(ipKey);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, passwordHash },
  });

  const role = await maybePromote(user);
  await createSession({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role,
    plan: asPlan((user as { plan?: string }).plan),
  });

  redirect("/dashboard");
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const values = { email: String(formData.get("email") ?? "").slice(0, 160) };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input", values };
  }
  const { email, password } = parsed.data;

  // Guessing limits: per account and per network.
  const emailKey = `login:${email}`;
  const ipKey = `login-ip:${await clientIp()}`;
  if ((await limited(emailKey, 8, 15 * MINUTE)) || (await limited(ipKey, 30, 15 * MINUTE))) {
    return { error: "Too many attempts. Wait 15 minutes, or reset your password.", values };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user?.passwordHash || !ok) {
    await Promise.all([hit(emailKey), hit(ipKey)]);
    return { error: "Incorrect email or password", values };
  }
  if (user.status === "SUSPENDED") {
    return { error: "This account has been suspended", values };
  }
  await clear(emailKey);

  const role = await maybePromote(user);
  await createSession(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role,
      plan: asPlan((user as { plan?: string }).plan),
    },
    formData.get("remember") !== null,
  );

  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export type ResetRequestState = { sent?: boolean; error?: string; email?: string } | undefined;

/**
 * "Forgot password": email a one-hour reset link. The answer is the same
 * whether or not the address has an account, so it can't be used to probe.
 */
export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData,
): Promise<ResetRequestState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 160);
  if (!z.string().email().safeParse(email).success) return { error: "Enter a valid email", email };
  if (!emailConfigured()) return { error: "no-email", email };

  const ipKey = `reset-ip:${await clientIp()}`;
  const emailKey = `reset:${email}`;
  if ((await limited(ipKey, 10, 60 * MINUTE)) || (await limited(emailKey, 3, 60 * MINUTE))) {
    return { sent: true, email };
  }
  await Promise.all([hit(ipKey), hit(emailKey)]);

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, status: true } });
  if (user?.status === "ACTIVE") {
    const link = await resetLink(user.id);
    if (link) {
      await sendEmail({
        to: email,
        subject: "Reset your AURA password",
        text: `Someone (hopefully you) asked to reset the password for your AURA account.\n\nSet a new one here — the link works for one hour:\n${link}\n\nIf it wasn't you, ignore this email; your password stays the same.`,
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
<p>Someone (hopefully you) asked to reset the password for your AURA account.</p>
<p><a href="${link}" style="display:inline-block;background:#00e5a0;color:#04120c;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">Set a new password</a></p>
<p style="color:#666;font-size:13px">The link works for one hour. If it wasn't you, ignore this email — your password stays the same.</p></div>`,
      });
    }
  }
  return { sent: true, email };
}

export type ResetState = { error?: string } | undefined;

/** Set a new password from a reset link, end every other session, sign in. */
export async function resetPassword(token: string, _prev: ResetState, formData: FormData): Promise<ResetState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Password must be at least 8 characters" };
  const user = await verifyReset(token);
  if (!user) return { error: "This link has expired or was already used. Ask for a new one." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  await clear(`login:${user.email}`);
  await createSession({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    plan: asPlan(user.plan),
  });
  redirect("/dashboard");
}
