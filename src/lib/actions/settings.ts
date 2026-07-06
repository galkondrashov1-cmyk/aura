"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import { RESERVED_SLUGS } from "@/lib/reserved";

export type SettingsState = { error?: string; saved?: boolean } | null;

const settingsSchema = z.object({
  businessName: z.string().min(2, "מה שם העסק?").max(60),
  ownerName: z.string().min(2, "איך קוראים לך?").max(60),
  slug: z
    .string()
    .min(2, "כתובת קצרה מדי")
    .max(30, "כתובת ארוכה מדי")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "אותיות באנגלית (קטנות), מספרים ומקפים בלבד")
    .refine((s) => !RESERVED_SLUGS.includes(s), "הכתובת הזו שמורה למערכת"),
  phone: z.string().max(20).optional(),
});

export async function saveSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await getSession();
  if (!session) return { error: "לא מחוברים" };

  const parsed = settingsSchema.safeParse({
    businessName: formData.get("businessName"),
    ownerName: formData.get("ownerName"),
    slug: String(formData.get("slug") ?? "").toLowerCase().trim(),
    phone: String(formData.get("phone") ?? "") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" };

  const { businessName, ownerName, slug, phone } = parsed.data;
  if (slug !== session.slug) {
    const taken = await prisma.business.findUnique({ where: { slug } });
    if (taken) return { error: "הכתובת הזו כבר תפוסה" };
  }

  const biz = await prisma.business.update({
    where: { id: session.id },
    data: { name: businessName, ownerName, slug, phone: phone ?? null },
  });
  await createSession({
    id: biz.id,
    email: biz.email,
    slug: biz.slug,
    name: biz.name,
    ownerName: biz.ownerName,
    plan: biz.plan,
  });
  revalidatePath("/dashboard/settings");
  return { saved: true };
}

const bookingSchema = z.object({
  autoConfirm: z.boolean(),
  slotStepMin: z.coerce.number().int().min(5).max(120),
  bufferMin: z.coerce.number().int().min(0).max(120),
});

export async function saveBookingSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await getSession();
  if (!session) return { error: "לא מחוברים" };

  const parsed = bookingSchema.safeParse({
    autoConfirm: formData.get("autoConfirm") === "auto",
    slotStepMin: formData.get("slotStepMin"),
    bufferMin: formData.get("bufferMin"),
  });
  if (!parsed.success) return { error: "ערכים לא תקינים" };

  await prisma.business.update({ where: { id: session.id }, data: parsed.data });
  revalidatePath("/dashboard/settings");
  return { saved: true };
}

const passwordSchema = z.object({
  current: z.string().min(1, "נא להזין את הסיסמה הנוכחית"),
  next: z.string().min(8, "סיסמה חדשה של לפחות 8 תווים"),
});

export async function changePassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await getSession();
  if (!session) return { error: "לא מחוברים" };

  const parsed = passwordSchema.safeParse({
    current: formData.get("current"),
    next: formData.get("next"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" };

  const biz = await prisma.business.findUnique({ where: { id: session.id } });
  if (!biz || !(await bcrypt.compare(parsed.data.current, biz.passwordHash))) {
    return { error: "הסיסמה הנוכחית שגויה" };
  }
  await prisma.business.update({
    where: { id: session.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });
  return { saved: true };
}
