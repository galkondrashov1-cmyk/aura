"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { buttonClasses } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-3">
      <Input
        name="email"
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        required
      />
      <PasswordInput
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted select-none">
        <input
          type="checkbox"
          name="remember"
          defaultChecked
          className="h-4 w-4 accent-primary"
        />
        Remember me
      </label>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", "md", "w-full")}
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
