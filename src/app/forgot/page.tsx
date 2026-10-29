import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/reset-forms";

export const metadata: Metadata = { title: "Reset your password · AURA", robots: { index: false } };

export default function ForgotPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
      footer={
        <Link href="/login" className="text-text underline-offset-4 hover:underline">
          Back to log in
        </Link>
      }
    >
      <ForgotForm support={process.env.SUPPORT_EMAIL ?? null} />
    </AuthShell>
  );
}
