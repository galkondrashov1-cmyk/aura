"use client";

import { useActionState } from "react";
import { Shield } from "lucide-react";
import { unlockAdminAction, type UnlockState } from "@/lib/actions/admin";
import { buttonClasses } from "@/components/ui/button";

export function AdminUnlock() {
  const [state, action, pending] = useActionState<UnlockState, FormData>(
    unlockAdminAction,
    undefined,
  );
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4" data-mode="muted">
      <form
        action={action}
        className="aura-glow w-full max-w-sm rounded-3xl border border-border bg-surface p-7 text-center"
      >
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-primary">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-medium">Admin access</h1>
        <p className="mt-1 mb-5 text-sm text-text-muted">Enter the admin code to continue.</p>
        <input
          name="code"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          placeholder="Code"
          className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-center text-lg tracking-[0.3em] text-text placeholder:tracking-normal placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
        {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className={buttonClasses("primary", "md", "mt-4 w-full")}
        >
          {pending ? "Checking…" : "Unlock"}
        </button>
      </form>
    </div>
  );
}
