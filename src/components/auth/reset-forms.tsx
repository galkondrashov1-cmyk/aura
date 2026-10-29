"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import {
  requestPasswordReset,
  resetPassword,
  type ResetRequestState,
  type ResetState,
} from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { buttonClasses } from "@/components/ui/button";

export function ForgotForm({ support }: { support: string | null }) {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(requestPasswordReset, undefined);

  if (state?.sent) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm">
        <MailCheck className="mb-2 h-5 w-5 text-primary" />
        If <span className="font-medium">{state.email}</span> has an AURA account, a reset link is on its way. It works for
        one hour — check spam if you don&apos;t see it.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <Input name="email" type="email" placeholder="you@email.com" autoComplete="email" defaultValue={state?.email} required />
      {state?.error === "no-email" ? (
        <p className="text-sm text-text-muted">
          Password emails aren&apos;t switched on yet.{" "}
          {support ? (
            <>
              Write to{" "}
              <a href={`mailto:${support}?subject=AURA password reset`} className="text-text underline">
                {support}
              </a>{" "}
              from this address and we&apos;ll send you a reset link.
            </>
          ) : (
            "Contact the AURA team from this address and we'll send you a reset link."
          )}
        </p>
      ) : (
        state?.error && <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetPassword.bind(null, token), undefined);
  return (
    <form action={action} className="space-y-3">
      <PasswordInput name="password" placeholder="New password (8+ characters)" autoComplete="new-password" minLength={8} required />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "Saving…" : "Save & log in"}
      </button>
    </form>
  );
}
