"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
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
      <Input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
      />
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
