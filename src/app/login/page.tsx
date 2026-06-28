import Link from "next/link";
import { AuraLogo } from "@/components/aura-logo";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="aura-backdrop flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <Link href="/" className="mb-8">
        <AuraLogo />
      </Link>

      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-7">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Log in to your AURA dashboard.
        </p>

        <button
          type="button"
          disabled
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-medium text-text-muted opacity-60"
        >
          Continue with Google
          <span className="text-xs">· soon</span>
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-text-muted">
          <span className="aura-rule flex-1" />
          or
          <span className="aura-rule flex-1" />
        </div>

        <LoginForm />

        <p className="mt-5 text-center text-sm text-text-muted">
          New here?{" "}
          <Link
            href="/signup"
            className="text-text underline-offset-4 hover:underline"
          >
            Create your AURA
          </Link>
        </p>
      </div>

      <p className="mt-6 text-xs text-text-muted">
        Email + password works now · Google sign-in lands in a later phase
      </p>
    </div>
  );
}
