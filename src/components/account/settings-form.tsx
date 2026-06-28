"use client";

import { useActionState } from "react";
import {
  updateProfileAction,
  changePasswordAction,
  type SettingsState,
} from "@/lib/actions/account";
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

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-medium">Profile</h2>
        <form action={pAction} className="mt-4 space-y-3">
          <Field label="Name">
            <Input name="name" defaultValue={name} placeholder="Your name" />
          </Field>
          <Field label="Username">
            <div className="flex h-11 items-center rounded-xl border border-border bg-surface-2 px-4 text-sm focus-within:ring-2 focus-within:ring-primary/50">
              <span className="text-text-muted">useaura.me/</span>
              <input
                name="username"
                defaultValue={username}
                className="ml-0.5 flex-1 bg-transparent text-text focus:outline-none"
              />
            </div>
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
            <Input name="current" type="password" autoComplete="current-password" />
          </Field>
          <Field label="New password">
            <Input
              name="next"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </Field>
          {wState?.error && <p className="text-sm text-red-400">{wState.error}</p>}
          {wState?.ok && <p className="text-sm text-primary">Password updated.</p>}
          <button type="submit" disabled={wPending} className={buttonClasses("primary", "md")}>
            {wPending ? "Updating…" : "Change password"}
          </button>
        </form>
      </section>
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
