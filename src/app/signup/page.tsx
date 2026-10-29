import { titled } from "@/lib/brand";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: titled("הרשמה") };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  // Already signed in? Never ask again — straight to the dashboard.
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="צרו עמוד משלכם"
      subtitle="תפסו את השם שלכם ובנו עמוד בכמה דקות. בחינם, בלי כרטיס אשראי."
      footer={
        <>
          כבר יש לכם חשבון?{" "}
          <Link href="/login" className="text-text underline-offset-4 hover:underline">
            התחברות
          </Link>
        </>
      }
    >
      <SignupForm initialName={((await searchParams).u ?? "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20)} />
    </AuthShell>
  );
}
