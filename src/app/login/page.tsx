import { titled } from "@/lib/brand";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: titled("התחברות") };

export default async function LoginPage() {
  // Already signed in? Never ask again — straight to the dashboard.
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="טוב לראות אתכם שוב"
      subtitle="התחברו ללוח הבקרה שלכם."
      footer={
        <>
          חדשים כאן?{" "}
          <Link href="/signup" className="text-text underline-offset-4 hover:underline">
            צרו עמוד משלכם
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
