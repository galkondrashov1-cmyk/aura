import Link from "next/link";
import type { Metadata } from "next";
import { HilaLogo } from "@/components/ui";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "התחברות" };

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8">
        <HilaLogo size={34} />
      </Link>
      <div className="card w-full max-w-md p-7">
        <h1 className="text-2xl font-extrabold">טוב לראות אותך שוב</h1>
        <p className="mb-6 mt-1 text-sm text-ink-2">מתחברים ללוח הבקרה של העסק.</p>
        <LoginForm />
      </div>
    </div>
  );
}
