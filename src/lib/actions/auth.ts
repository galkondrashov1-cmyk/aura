"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, sessionOf } from "@/lib/session";
import { DEFAULT_CONTENT } from "@/lib/content";
import { DEFAULT_DESIGN } from "@/lib/design";

import { RESERVED_SLUGS } from "@/lib/reserved";

export type AuthState = { error?: string } | null;

const slugSchema = z
  .string()
  .min(2, "כתובת קצרה מדי (לפחות 2 תווים)")
  .max(30, "כתובת ארוכה מדי (עד 30 תווים)")
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "אותיות באנגלית (קטנות), מספרים ומקפים בלבד")
  .refine((s) => !RESERVED_SLUGS.includes(s), "הכתובת הזו שמורה למערכת");

const signupSchema = z.object({
  ownerName: z.string().min(2, "איך קוראים לך?").max(60),
  businessName: z.string().min(2, "מה שם העסק?").max(60),
  slug: slugSchema,
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(8, "סיסמה של לפחות 8 תווים"),
});

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    ownerName: formData.get("ownerName"),
    businessName: formData.get("businessName"),
    slug: String(formData.get("slug") ?? "").toLowerCase().trim(),
    email: String(formData.get("email") ?? "").toLowerCase().trim(),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" };
  }
  const { ownerName, businessName, slug, email, password } = parsed.data;

  const emailTaken = await prisma.business.findUnique({ where: { email } });
  if (emailTaken) return { error: "כבר קיים חשבון עם האימייל הזה" };
  const slugTaken = await prisma.business.findUnique({ where: { slug } });
  if (slugTaken) return { error: "הכתובת הזו כבר תפוסה — נסו אחרת" };

  const passwordHash = await bcrypt.hash(password, 10);
  const biz = await prisma.business.create({
    data: {
      email,
      passwordHash,
      ownerName,
      name: businessName,
      slug,
      site: {
        create: {
          content: { ...DEFAULT_CONTENT, tagline: "ברוכים הבאים! כאן כותבים משפט קצר על העסק." },
          design: DEFAULT_DESIGN,
        },
      },
      // Sunday–Thursday 09:00–17:00 starter hours so booking works out of the box.
      hours: {
        create: [0, 1, 2, 3, 4].map((day) => ({ day, startMin: 540, endMin: 1020 })),
      },
    },
  });

  await createSession(sessionOf(biz));
  redirect("/dashboard");
}

const loginSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "נא להזין סיסמה"),
});

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").toLowerCase().trim(),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" };
  }
  const biz = await prisma.business.findUnique({ where: { email: parsed.data.email } });
  if (!biz || !(await bcrypt.compare(parsed.data.password, biz.passwordHash))) {
    return { error: "אימייל או סיסמה שגויים" };
  }
  await createSession(sessionOf(biz));
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
