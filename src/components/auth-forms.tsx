"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction, loginAction, type AuthState } from "@/lib/actions/auth";
import { Button, Input, Label } from "@/components/ui";

function ErrorNote({ state }: { state: AuthState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">{state.error}</p>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, null);
  const [slug, setSlug] = useState("");
  return (
    <form action={action} className="flex flex-col gap-4">
      <ErrorNote state={state} />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ownerName">השם שלך</Label>
          <Input id="ownerName" name="ownerName" placeholder="דנה כהן" required />
        </div>
        <div>
          <Label htmlFor="businessName">שם העסק</Label>
          <Input id="businessName" name="businessName" placeholder="סטודיו דנה" required />
        </div>
      </div>
      <div>
        <Label htmlFor="slug">הכתובת של העמוד שלך</Label>
        <div className="flex items-center gap-2" dir="ltr">
          <span className="text-sm text-ink-2">hila.co.il/</span>
          <Input
            id="slug"
            name="slug"
            placeholder="dana-studio"
            dir="ltr"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            required
          />
        </div>
        <p className="mt-1 text-xs text-ink-2">אותיות באנגלית, מספרים ומקפים.</p>
      </div>
      <div>
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" dir="ltr" placeholder="you@example.com" required />
      </div>
      <div>
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" dir="ltr" placeholder="לפחות 8 תווים" required minLength={8} />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 py-3 text-base">
        {pending ? "פותחים חשבון…" : "פותחים חשבון בחינם"}
      </Button>
      <p className="text-center text-sm text-ink-2">
        כבר יש לך חשבון?{" "}
        <Link href="/login" className="font-semibold text-halo hover:underline">
          התחברות
        </Link>
      </p>
    </form>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <ErrorNote state={state} />
      <div>
        <Label htmlFor="email">אימייל</Label>
        <Input id="email" name="email" type="email" dir="ltr" placeholder="you@example.com" required />
      </div>
      <div>
        <Label htmlFor="password">סיסמה</Label>
        <Input id="password" name="password" type="password" dir="ltr" required />
      </div>
      <Button type="submit" disabled={pending} className="mt-2 py-3 text-base">
        {pending ? "מתחברים…" : "התחברות"}
      </Button>
      <p className="text-center text-sm text-ink-2">
        עדיין אין לך חשבון?{" "}
        <Link href="/signup" className="font-semibold text-halo hover:underline">
          נרשמים בחינם
        </Link>
      </p>
    </form>
  );
}
