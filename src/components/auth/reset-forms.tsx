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
      <div className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm">
        <MailCheck className="mb-2 h-5 w-5 text-primary-text" />
        אם ל־<span className="font-medium">{state.email}</span> יש חשבון אצלנו, קישור איפוס כבר בדרך. הוא תקף לשעה — אם
        לא הגיע, בדקו בספאם.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-3">
      <Input name="email" type="email" placeholder="you@email.com" dir="ltr" autoComplete="email" defaultValue={state?.email} required />
      {state?.error === "no-email" ? (
        <p className="text-sm text-text-muted">
          שליחת מיילים עוד לא הופעלה.{" "}
          {support ? (
            <>
              כתבו ל־{" "}
              <a href={`mailto:${support}?subject=איפוס סיסמה`} className="text-text underline">
                {support}
              </a>{" "}
              מהכתובת הזו ונשלח לכם קישור איפוס.
            </>
          ) : (
            "פנו אלינו מהכתובת הזו ונשלח לכם קישור איפוס."
          )}
        </p>
      ) : (
        state?.error && <p className="text-sm text-red-400">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "שולחים…" : "שליחת קישור איפוס"}
      </button>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(resetPassword.bind(null, token), undefined);
  return (
    <form action={action} className="space-y-3">
      <PasswordInput name="password" placeholder="סיסמה חדשה (8 תווים לפחות)" autoComplete="new-password" minLength={8} required />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "שומרים…" : "שמירה והתחברות"}
      </button>
    </form>
  );
}
