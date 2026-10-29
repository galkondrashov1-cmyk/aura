"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Strings } from "@/lib/i18n";

/**
 * Newsletter / contact form. Submissions land in the owner's Inbox. Only
 * live on published pages (pageId set) — in the editor and draft preview it
 * shows what visitors will see without sending anything.
 */
export function FormView({
  pageId,
  blockId,
  kind,
  button,
  success,
  buttonClass,
  t,
}: {
  pageId?: string;
  blockId: string;
  kind: "newsletter" | "contact";
  button?: string;
  success?: string;
  buttonClass?: string;
  t: Strings;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pageId) {
      setState("done");
      return;
    }
    const fd = new FormData(e.currentTarget);
    setState("sending");
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pageId,
          blockId,
          name: fd.get("name") ?? undefined,
          email: fd.get("email"),
          message: fd.get("message") ?? undefined,
          website: fd.get("website"), // honeypot
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-4 text-sm text-text">
        <Check className="h-4 w-4 text-primary" />
        {pageId ? success || t.thanks : t.preview}
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-border bg-surface/70 px-4 text-sm text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      {/* Honeypot: invisible to people, irresistible to bots. */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {kind === "contact" && (
        <input name="name" required maxLength={80} placeholder={t.name} className={cn(field, "h-11")} />
      )}
      <div className={cn(kind === "newsletter" && "flex gap-2")}>
        <input
          name="email"
          type="email"
          required
          maxLength={160}
          placeholder={t.email}
          className={cn(field, "h-11 min-w-0 flex-1")}
        />
        {kind === "newsletter" && (
          <button
            type="submit"
            disabled={state === "sending"}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl px-4 text-sm font-medium",
              buttonClass ?? "aura-glow bg-primary text-primary-ink",
            )}
          >
            {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : button || t.join}
          </button>
        )}
      </div>
      {kind === "contact" && (
        <>
          <textarea
            name="message"
            required
            maxLength={2000}
            rows={4}
            placeholder={t.message}
            className={cn(field, "resize-none py-3")}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium",
              buttonClass ?? "aura-glow bg-primary text-primary-ink",
            )}
          >
            {state === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4 rtl:-scale-x-100" /> {button || t.send}
              </>
            )}
          </button>
        </>
      )}
      {state === "error" && <p className="text-center text-xs text-red-400">{error}</p>}
    </form>
  );
}
