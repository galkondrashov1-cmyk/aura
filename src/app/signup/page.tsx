import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create your AURA" };

export default async function SignupPage() {
  // Already signed in? Never ask again — straight to the dashboard.
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthShell
      title="Create your AURA"
      subtitle="Claim your name and build your page in minutes. Free, no card."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-text underline-offset-4 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
