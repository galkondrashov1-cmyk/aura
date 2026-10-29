"use client";

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
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium">Profile</h2>
        <form action={pAction} className="mt-4 space-y-3">
          <Field label="Name">
            <Input name="name" defaultValue={pState?.values?.name ?? name} placeholder="Your name" maxLength={60} />
          </Field>
          <Field label="Username">
            <div className="flex h-11 items-center rounded-xl border border-border bg-surface-2 px-4 text-sm focus-within:ring-2 focus-within:ring-primary/50">
              <span className="text-text-muted">useaura.me/</span>
              <input
                name="username"
                defaultValue={pState?.values?.username ?? username}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={20}
                className="ml-0.5 min-w-0 flex-1 bg-transparent text-text focus:outline-none"
              />
            </div>
            <span className="mt-1.5 block text-[11px] text-text-muted">
              Changing it changes your link — the old address stops working.
            </span>
          </Field>
          <Field label="Email">
            <Input defaultValue={email} disabled />
          </Field>
          {pState?.error && <p className="text-sm text-red-400">{pState.error}</p>}
          {pState?.ok && <p className="text-sm text-primary">Saved.</p>}
          <button type="submit" disabled={pPending} className={buttonClasses("primary", "md")}>
            {pPending ? "Saving…" : "Save profile"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium">Password</h2>
        <form action={wAction} className="mt-4 space-y-3">
          <Field label="Current password">
            <PasswordInput name="current" autoComplete="current-password" required />
          </Field>
          <Field label="New password">
            <PasswordInput name="next" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required />
          </Field>
          {wState?.error && <p className="text-sm text-red-400">{wState.error}</p>}
          {wState?.ok && <p className="text-sm text-primary">Password updated. Other devices were signed out.</p>}
          <button type="submit" disabled={wPending} className={buttonClasses("primary", "md")}>
            {wPending ? "Updating…" : "Change password"}
          </button>
        </form>
      </section>

      <details className="group rounded-2xl border border-red-500/30 bg-surface p-6">
        <summary className="cursor-pointer list-none font-display text-lg font-medium text-red-400">Delete account</summary>
        <p className="mt-2 text-sm text-text-muted">
          Permanently deletes your pages, uploads, form entries and analytics, and frees @{username}. Any subscription is
          cancelled. This can&apos;t be undone.
        </p>
        <form action={dAction} className="mt-4 space-y-3">
          <Field label={`Type ${username} to confirm`}>
            <Input name="confirm" autoComplete="off" autoCapitalize="none" required />
          </Field>
          <Field label="Password">
            <PasswordInput name="password" autoComplete="current-password" required />
          </Field>
          {dState?.error && <p className="text-sm text-red-400">{dState.error}</p>}
          <button
            type="submit"
            disabled={dPending}
            className="inline-flex h-11 items-center rounded-full bg-red-500/90 px-5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
          >
            {dPending ? "Deleting…" : "Delete my account"}
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
