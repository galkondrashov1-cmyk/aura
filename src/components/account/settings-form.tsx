"use client";

import { BRAND } from "@/lib/brand";
import { useActionState } from "react";
import {
  updateProfileAction,
  changePasswordAction,
  deleteAccountAction,
  type SettingsState,
} from "@/lib/actions/account";
import { PasswordInput } from "@/components/auth/password-input";
import { Input } from "@/components/ui/input";
import { buttonClasses } from "@/components/ui/button";

export function SettingsForm({
  name,
  username,
  email,
}: {
  name: string;
  username: string;
  email: string;
}) {
  const [pState, pAction, pPending] = useActionState<SettingsState, FormData>(
    updateProfileAction,
    undefined,
  );
  const [wState, wAction, wPending] = useActionState<SettingsState, FormData>(
    changePasswordAction,
    undefined,
  );
  const [dState, dAction, dPending] = useActionState<SettingsState, FormData>(deleteAccountAction, undefined);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium">פרופיל</h2>
        <form action={pAction} className="mt-4 space-y-3">
          <Field label="שם">
            <Input name="name" defaultValue={pState?.values?.name ?? name} placeholder="השם שלכם" maxLength={60} />
          </Field>
          <Field label="שם משתמש">
            <div className="flex h-11 items-center rounded-xl border border-border bg-surface-2 px-4 text-sm focus-within:ring-2 focus-within:ring-primary/50">
              <span className="text-text-muted">{BRAND.domain}/</span>
              <input
                name="username"
                defaultValue={pState?.values?.username ?? username}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={20}
                size={1}
                className="ms-0.5 min-w-0 flex-1 bg-transparent text-text focus:outline-none"
              />
            </div>
            <span className="mt-1.5 block text-[11px] text-text-muted">
              שינוי השם משנה את הקישור שלכם — הכתובת הישנה תפסיק לעבוד.
            </span>
          </Field>
          <Field label="מייל">
            <Input defaultValue={email} disabled />
          </Field>
          {pState?.error && <p className="text-sm text-red-400">{pState.error}</p>}
          {pState?.ok && <p className="text-sm text-primary-text">נשמר.</p>}
          <button type="submit" disabled={pPending} className={buttonClasses("primary", "md")}>
            {pPending ? "שומרים…" : "שמירת פרופיל"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium">סיסמה</h2>
        <form action={wAction} className="mt-4 space-y-3">
          <Field label="סיסמה נוכחית">
            <PasswordInput name="current" autoComplete="current-password" required />
          </Field>
          <Field label="סיסמה חדשה">
            <PasswordInput name="next" autoComplete="new-password" placeholder="8 תווים לפחות" minLength={8} required />
          </Field>
          {wState?.error && <p className="text-sm text-red-400">{wState.error}</p>}
          {wState?.ok && <p className="text-sm text-primary-text">הסיסמה עודכנה. שאר המכשירים נותקו.</p>}
          <button type="submit" disabled={wPending} className={buttonClasses("primary", "md")}>
            {wPending ? "מעדכנים…" : "שינוי סיסמה"}
          </button>
        </form>
      </section>

      <details className="group rounded-lg border border-red-500/30 bg-surface p-6">
        <summary className="cursor-pointer list-none font-display text-lg font-medium text-red-400">מחיקת חשבון</summary>
        <p className="mt-2 text-sm text-text-muted">
          מוחק לצמיתות את העמודים, ההעלאות, הפניות והנתונים שלכם, ומשחרר את @{username}. מנוי פעיל יבוטל. אי אפשר
          לבטל את הפעולה.
        </p>
        <form action={dAction} className="mt-4 space-y-3">
          <Field label={`הקלידו ${username} לאישור`}>
            <Input name="confirm" autoComplete="off" autoCapitalize="none" required />
          </Field>
          <Field label="סיסמה">
            <PasswordInput name="password" autoComplete="current-password" required />
          </Field>
          {dState?.error && <p className="text-sm text-red-400">{dState.error}</p>}
          <button
            type="submit"
            disabled={dPending}
            className="inline-flex h-11 items-center rounded-full bg-red-500/90 px-5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {dPending ? "מוחקים…" : "מחיקת החשבון שלי"}
          </button>
        </form>
      </details>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-text-muted">{label}</span>
      {children}
    </label>
  );
}
