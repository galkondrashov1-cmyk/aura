import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-forms";
import { verifyReset } from "@/lib/reset-token";

export const metadata: Metadata = { title: "Set a new password · AURA", robots: { index: false } };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const user = token ? await verifyReset(token) : null;

  if (!user) {
    return (
      <AuthShell title="This link has expired" subtitle="Reset links work for one hour and only once.">
        <Link
          href="/forgot"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-ink"
        >
          Send me a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle={`For @${user.username}. You'll be logged in right after.`}>
      <ResetForm token={token} />
    </AuthShell>
  );
}
