"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { buttonClasses } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, undefined);

  return (
    <form action={action} className="space-y-3">
      <Input
        name="email"
        type="email"
        placeholder="you@email.com" dir="ltr"
        autoComplete="email"
        defaultValue={state?.values?.email}
        required
      />
      <PasswordInput name="password" placeholder="סיסמה" autoComplete="current-password" required />
      <div className="flex items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted select-none">
          <input type="checkbox" name="remember" defaultChecked className="h-4 w-4 accent-primary" />
          לזכור אותי
        </label>
        <Link href="/forgot" className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline">
          שכחתי סיסמה
        </Link>
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "מתחברים…" : "התחברות"}
      </button>
    </form>
  );
}
