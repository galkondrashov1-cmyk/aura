import { titled } from "@/lib/brand";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-forms";
import { verifyReset } from "@/lib/reset-token";

export const metadata: Metadata = { title: titled("סיסמה חדשה"), robots: { index: false } };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const user = token ? await verifyReset(token) : null;

  if (!user) {
    return (
      <AuthShell title="תוקף הקישור פג" subtitle="קישורי איפוס עובדים שעה אחת ופעם אחת בלבד.">
        <Link
          href="/forgot"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-ink"
        >
          שלחו לי קישור חדש
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="בחירת סיסמה חדשה" subtitle={`עבור @${user.username}. מיד אחר כך תהיו מחוברים.`}>
      <ResetForm token={token} />
    </AuthShell>
  );
}
