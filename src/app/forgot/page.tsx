import { titled } from "@/lib/brand";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/reset-forms";

export const metadata: Metadata = { title: titled("איפוס סיסמה"), robots: { index: false } };

export default function ForgotPage() {
  return (
    <AuthShell
      title="שכחתם את הסיסמה?"
      subtitle="הזינו את המייל שלכם ונשלח קישור לבחירת סיסמה חדשה."
      footer={
        <Link href="/login" className="text-text underline-offset-4 hover:underline">
          חזרה להתחברות
        </Link>
      }
    >
      <ForgotForm support={process.env.SUPPORT_EMAIL ?? null} />
    </AuthShell>
  );
}
