"use client";

// TEMPORARY SITE GATE — access-code screen. Remove together with
// src/app/api/gate and the gate block in src/proxy.ts.
import { useState } from "react";
import { AuraLogo } from "@/components/aura-logo";

export default function GatePage() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const res = await fetch("/api/gate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      window.location.href = "/";
    } else {
      setErr(true);
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form onSubmit={submit} className="w-full max-w-xs space-y-5 text-center">
        <div className="flex justify-center">
          <AuraLogo />
        </div>
        <p className="text-sm text-text-muted">
          This site is private. Enter the access code to continue.
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          autoFocus
          placeholder="• • • •"
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-center text-lg tracking-[0.4em] text-text outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        />
        {err && <p className="text-sm text-red-400">Wrong code — try again.</p>}
        <button
          type="submit"
          disabled={busy}
          className="aura-glow w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-ink disabled:opacity-60"
        >
          {busy ? "…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
