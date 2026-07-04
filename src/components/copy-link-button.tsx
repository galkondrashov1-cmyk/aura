"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";

/** Copies the page's public URL. Falls back to a prompt when clipboard is blocked. */
export function CopyLinkButton({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy your page link:", url);
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={url}
      className={cn(buttonClasses("ghost", "sm"), className)}
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
