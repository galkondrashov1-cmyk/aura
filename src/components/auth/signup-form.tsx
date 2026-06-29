"use client";

import { useActionState } from "react";
import { signupAction, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { buttonClasses } from "@/components/ui/button";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signupAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-3">
      <div className="flex h-11 items-center rounded-xl border border-border bg-surface-2 px-4 text-sm focus-within:ring-2 focus-within:ring-primary/50">
        <span className="text-text-muted">useaura.me/</span>
        <input
          name="username"
          placeholder="yourname"
          autoComplete="off"
          required
          className="ml-0.5 flex-1 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <Input
        name="email"
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        required
      />
      <PasswordInput
        name="password"
        placeholder="Choose a password (8+ characters)"
        autoComplete="new-password"
        required
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", "md", "w-full")}
      >
        {pending ? "Creating…" : "Create your AURA"}
      </button>
    </form>
  );
}
