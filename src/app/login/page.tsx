import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Log in · AURA" };

export default async function LoginPage() {
  // Already signed in? Never ask again — straight to the dashboard.
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your AURA dashboard."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="text-text underline-offset-4 hover:underline">
            Create your AURA
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
