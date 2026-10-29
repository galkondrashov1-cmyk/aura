import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-[4px] border border-border bg-surface px-4 text-[0.95rem] text-text placeholder:text-text-muted transition-colors focus-visible:border-text focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
}
