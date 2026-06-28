"use client";

import { useActionState, useState } from "react";
import { Sparkles } from "lucide-react";
import { aiGenerateAction, type AiState } from "@/lib/actions/pages";
import { buttonClasses } from "@/components/ui/button";

const EXAMPLES = [
  "I'm a fitness coach selling online training programs.",
  "I'm an indie musician releasing my first album.",
  "I'm a freelance brand designer taking on new clients.",
];

export function AiForm() {
  const [value, setValue] = useState("");
  const [state, action, pending] = useActionState<AiState, FormData>(
    aiGenerateAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <textarea
        name="prompt"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Describe yourself or your business…"
        className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      />

      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setValue(ex)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-primary/50 hover:text-text"
          >
            {ex}
          </button>
        ))}
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses("primary", "md")}
      >
        <Sparkles className="h-4 w-4" />
        {pending ? "Designing your page…" : "Generate my page"}
      </button>
    </form>
  );
}
