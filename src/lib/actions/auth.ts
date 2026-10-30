"use server";

import { BRAND } from "@/lib/brand";
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
    .min(3, "שם המשתמש צריך לפחות 3 תווים")
    .max(20, "שם המשתמש יכול להכיל עד 20 תווים")
    .regex(/^[a-z0-9_]+$/, "רק אותיות קטנות באנגלית, ספרות וקו תחתון"),
  email: z.string().trim().toLowerCase().email("הזינו כתובת מייל תקינה"),
  password: z.string().min(8, "הסיסמה צריכה לפחות 8 תווים"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("הזינו כתובת מייל תקינה"),
  password: z.string().min(1, "הזינו סיסמה"),
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
    return { error: parsed.error.issues[0]?.message ?? "הפרטים לא תקינים", values };
  }
  const { username, email, password } = parsed.data;

  if (RESERVED.has(username)) {
    return { error: "שם המשתמש הזה שמור", values };
  }

  const ipKey = `signup:${await clientIp()}`;
  if (await limited(ipKey, 8, 60 * MINUTE)) {
    return { error: "נפתחו יותר מדי חשבונות מהרשת שלכם — נסו שוב בעוד שעה.", values };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
  if (existing?.email === email) return { error: "המייל הזה כבר רשום — אולי להתחבר?", values };
  if (existing?.username === username) return { error: "שם המשתמש תפוס", values };
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

  // Straight into the guided builder: a new account has nothing else to see.
  redirect("/dashboard/new");
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
    return { error: parsed.error.issues[0]?.message ?? "הפרטים לא תקינים", values };
  }
  const { email, password } = parsed.data;

  // Guessing limits: per account and per network.
  const emailKey = `login:${email}`;
  const ipKey = `login-ip:${await clientIp()}`;
  if ((await limited(emailKey, 8, 15 * MINUTE)) || (await limited(ipKey, 30, 15 * MINUTE))) {
    return { error: "יותר מדי ניסיונות. חכו 15 דקות או אפסו את הסיסמה.", values };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user?.passwordHash || !ok) {
    await Promise.all([hit(emailKey), hit(ipKey)]);
    return { error: "מייל או סיסמה שגויים", values };
  }
  if (user.status === "SUSPENDED") {
    return { error: "החשבון הזה הושעה", values };
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
  if (!z.string().email().safeParse(email).success) return { error: "הזינו כתובת מייל תקינה", email };
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
        subject: `איפוס הסיסמה שלכם ב-${BRAND.name}`,
        text: `מישהו (כנראה אתם) ביקש לאפס את הסיסמה לחשבון שלכם ב-${BRAND.name}.\n\nבחרו סיסמה חדשה כאן — הקישור תקף לשעה:\n${link}\n\nאם זה לא הייתם אתם, התעלמו מהמייל; הסיסמה נשארת כמו שהיא.`,
        html: `<div dir="rtl" style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
<p>מישהו (כנראה אתם) ביקש לאפס את הסיסמה לחשבון שלכם ב-${BRAND.name}.</p>
<p><a href="${link}" style="display:inline-block;background:#00e5a0;color:#04120c;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">בחירת סיסמה חדשה</a></p>
<p style="color:#666;font-size:13px">הקישור תקף לשעה. אם זה לא הייתם אתם, התעלמו מהמייל — הסיסמה נשארת כמו שהיא.</p></div>`,
      });
    }
  }
  return { sent: true, email };
}

export type ResetState = { error?: string } | undefined;

/** Set a new password from a reset link, end every other session, sign in. */
export async function resetPassword(token: string, _prev: ResetState, formData: FormData): Promise<ResetState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "הסיסמה צריכה לפחות 8 תווים" };
  const user = await verifyReset(token);
  if (!user) return { error: "תוקף הקישור פג או שכבר השתמשו בו. בקשו קישור חדש." };

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
