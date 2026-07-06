import Link from "next/link";
import type { Metadata } from "next";
import { HilaLogo } from "@/components/ui";
import { SignupForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "הרשמה" };

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <Link href="/" className="mb-8">
        <HilaLogo size={34} />
      </Link>
      <div className="card w-full max-w-md p-7">
        <h1 className="text-2xl font-extrabold">יוצרים הילה לעסק שלך</h1>
        <p className="mb-6 mt-1 text-sm text-ink-2">
          ההרשמה לבעלי עסקים. הלקוחות שלך לא צריכים חשבון.
        </p>
        <SignupForm />
      </div>
    </div>
  );
}
