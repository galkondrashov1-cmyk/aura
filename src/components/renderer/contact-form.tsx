"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { RichTextView } from "@/components/rich-text-view";
import { isEmptyRich } from "@/lib/richtext";
import type { RichValue } from "@/lib/richtext";

const fieldCls =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

export function ContactForm({
  pageId,
  heading,
  buttonLabel,
  buttonFx,
  buttonIdle,
}: {
  pageId?: string;
  heading?: RichValue;
  buttonLabel?: string;
  buttonFx?: string;
  buttonIdle?: string;
}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!pageId) return; // builder preview — no real submission
    setBusy(true);
    const fd = new FormData(form);
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          pageId,
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-text-muted">
        Thanks — your message was sent.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
      {!isEmptyRich(heading) && (
        <h2 className="font-display mb-1 text-lg font-medium tracking-tight">
          <RichTextView value={heading} />
        </h2>
      )}
      <input name="name" required placeholder="Your name" className={fieldCls} />
      <input name="email" type="email" required placeholder="Email" className={fieldCls} />
      <textarea name="message" required rows={3} placeholder="Message" className={fieldCls} />
      <div className={buttonIdle}>
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "aura-glow flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-ink disabled:opacity-60",
            buttonFx,
          )}
        >
          {busy ? "Sending…" : (buttonLabel ?? "Send")}
        </button>
      </div>
    </form>
  );
}
