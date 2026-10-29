"use client";

import { BRAND } from "@/lib/brand";
import { useActionState, useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { signupAction, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NameCheck = { name: string; status: "checking" | "free" | "taken" | "reserved" | "format" };

const HINT: Record<Exclude<NameCheck["status"], "checking" | "free">, string> = {
  taken: "תפוס — נסו שם אחר",
  reserved: "שמור למערכת",
  format: "3–20 אותיות באנגלית, ספרות או _",
};

export function SignupForm({ initialName = "" }: { initialName?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signupAction, undefined);
  const [name, setName] = useState(state?.values?.username ?? initialName);
  const [check, setCheck] = useState<NameCheck | null>(null);

  // Debounced availability check while typing.
  useEffect(() => {
    const u = name.trim().toLowerCase();
    if (!u) return;
    const t = setTimeout(async () => {
      setCheck({ name: u, status: "checking" });
      const res = await fetch(`/api/username?u=${encodeURIComponent(u)}`)
        .then((r) => r.json() as Promise<{ available: boolean; reason: NameCheck["status"] | null }>)
        .catch(() => null);
      if (!res) return setCheck(null);
      setCheck({ name: u, status: res.available ? "free" : (res.reason ?? "taken") });
    }, 350);
    return () => clearTimeout(t);
  }, [name]);

  const current = check && check.name === name.trim().toLowerCase() ? check.status : null;

  return (
    <form action={action} className="space-y-3">
      <div>
        <div
          className={cn(
            "flex h-11 items-center rounded-xl border bg-surface-2 px-4 text-sm focus-within:ring-2 focus-within:ring-primary/50",
            current && current !== "free" && current !== "checking" ? "border-red-400/60" : "border-border",
          )}
        >
          <span className="text-text-muted">{BRAND.domain}/</span>
          <input
            name="username"
            placeholder="yourname"
            aria-label="שם משתמש"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={20}
            required
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            className="ms-0.5 min-w-0 flex-1 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
          />
          {current === "checking" && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
          {current === "free" && <Check className="h-4 w-4 text-primary-text" aria-label="פנוי" />}
          {current && current !== "free" && current !== "checking" && <X className="h-4 w-4 text-red-700" />}
        </div>
        {current && current !== "free" && current !== "checking" && (
          <p className="mt-1.5 text-xs text-red-700">{HINT[current]}</p>
        )}
      </div>
      <Input
        name="email"
        type="email"
        placeholder="you@email.com" dir="ltr"
        autoComplete="email"
        defaultValue={state?.values?.email}
        required
      />
      <PasswordInput name="password" placeholder="בחרו סיסמה (8 תווים לפחות)" autoComplete="new-password" minLength={8} required />
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className={buttonClasses("primary", "md", "w-full")}>
        {pending ? "יוצרים…" : "צרו עמוד משלכם"}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-text-muted">חבילה חינמית לתמיד · בלי כרטיס אשראי</p>
    </form>
  );
}
