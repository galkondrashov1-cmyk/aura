import Link from "next/link";
import type { Metadata } from "next";
import { HilaLogo } from "@/components/ui";
import { SignupForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "הרשמה" };

export default function SignupPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10">
      <div className="halo-orb pointer-events-none right-[12%] top-[8%] h-72 w-72" style={{ background: "#f0b429", opacity: 0.28 }} />
      <div className="halo-orb pointer-events-none bottom-[6%] left-[8%] h-80 w-80" style={{ background: "#8b7cf6", opacity: 0.2, animationDelay: "-6s" }} />
      <Link href="/" className="relative mb-8">
        <HilaLogo size={38} />
      </Link>
      <div className="relative w-full max-w-md">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-5 right-8 h-9 w-28 rounded-[50%]"
          style={{
            border: "2.5px solid rgba(240,180,41,0.8)",
            transform: "rotate(-7deg)",
            boxShadow: "0 0 18px rgba(240,180,41,0.5)",
          }}
        />
        <div className="card w-full p-7 backdrop-blur">
          <h1 className="text-2xl font-extrabold">בוא נדליק את האור ✨</h1>
          <p className="mb-6 mt-1 text-sm text-ink-2">
            ההרשמה לבעלי עסקים בלבד — הלקוחות שלך לא צריכים חשבון.
          </p>
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
