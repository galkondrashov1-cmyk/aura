"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Globe, EyeOff } from "lucide-react";
import { publishSite } from "@/lib/actions/site";
import { cn } from "@/lib/utils";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-2 rounded-xl bg-halo px-4 py-2.5 text-sm font-semibold text-night hover:bg-halo-2 cursor-pointer"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "הועתק!" : "העתקת קישור"}
    </button>
  );
}

export function PublishToggle({ published }: { published: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await publishSite(!published);
        })
      }
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition cursor-pointer disabled:opacity-60",
        published
          ? "bg-mint/15 text-mint hover:bg-mint/25"
          : "bg-halo text-night hover:bg-halo-2 shadow-[0_0_20px_rgba(240,180,41,0.3)]",
      )}
    >
      {published ? <Globe className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      {pending ? "רגע…" : published ? "העמוד באוויר" : "פרסום העמוד"}
    </button>
  );
}
