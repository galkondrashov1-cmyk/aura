"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Password field with a show/hide eye toggle. */
export function PasswordInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={cn(
          "h-12 w-full rounded-[4px] border border-border bg-surface ps-4 pe-11 text-[0.95rem] text-text placeholder:text-text-muted transition-colors focus-visible:border-text focus-visible:outline-none",
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        aria-label={show ? "הסתרת סיסמה" : "הצגת סיסמה"}
        className="absolute end-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-text-muted transition-colors hover:text-text"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
