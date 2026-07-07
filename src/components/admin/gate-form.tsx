"use client";

import { useActionState } from "react";
import { adminGateAction, type GateState } from "@/lib/actions/admin";
import { Button, Input } from "@/components/ui";

export function AdminGateForm() {
  const [state, action, pending] = useActionState<GateState, FormData>(adminGateAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      {state?.error && (
        <p className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">{state.error}</p>
      )}
      <Input
        name="code"
        type="password"
        inputMode="numeric"
        dir="ltr"
        placeholder="• • • •"
        className="text-center text-xl font-extrabold tracking-[0.5em]"
        autoFocus
        required
      />
      <Button type="submit" disabled={pending} className="py-3">
        {pending ? "בודקים…" : "כניסה לפאנל"}
      </Button>
    </form>
  );
}
