import { cn } from "@/lib/utils";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type ButtonVariant = "primary" | "ghost" | "danger" | "outline";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variant === "primary" &&
          "bg-halo text-night hover:bg-halo-2 shadow-[0_0_20px_rgba(240,180,41,0.25)]",
        variant === "ghost" && "text-ink-2 hover:text-ink hover:bg-white/5",
        variant === "outline" && "border border-line text-ink hover:bg-white/5",
        variant === "danger" && "bg-red-500/15 text-red-400 hover:bg-red-500/25",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-line bg-night-3 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-2/60 outline-none focus:border-halo/60 focus:ring-2 focus:ring-halo/20 transition",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border border-line bg-night-3 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-2/60 outline-none focus:border-halo/60 focus:ring-2 focus:ring-halo/20 transition resize-y",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border border-line bg-night-3 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-halo/60 transition cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink-2", className)} {...props} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function Badge({
  className,
  children,
  tone = "gold",
}: {
  className?: string;
  children: ReactNode;
  tone?: "gold" | "violet" | "green" | "red" | "gray";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "gold" && "bg-halo/15 text-halo",
        tone === "violet" && "bg-viole/15 text-viole",
        tone === "green" && "bg-mint/15 text-mint",
        tone === "red" && "bg-red-500/15 text-red-400",
        tone === "gray" && "bg-white/8 text-ink-2",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The הילה logo — the wordmark itself wears the halo (over the ה). */
export function HilaLogo({ size = 28, withWord = true }: { size?: number; withWord?: boolean }) {
  const word = size * 0.68;
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span className="relative inline-block" style={{ width: size, height: size }}>
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 200deg, #f0b429, #ffd166, #8b7cf6, #f0b429)",
            WebkitMask: "radial-gradient(farthest-side, transparent 58%, #000 62%)",
            mask: "radial-gradient(farthest-side, transparent 58%, #000 62%)",
            filter: "drop-shadow(0 0 6px rgba(240,180,41,0.55))",
          }}
        />
        <span
          className="absolute inset-[18%] rounded-full opacity-60"
          style={{ background: "radial-gradient(circle, rgba(240,180,41,0.55), transparent 70%)" }}
        />
      </span>
      {withWord && (
        <span
          className="font-extrabold tracking-tight text-ink"
          style={{ fontSize: word, lineHeight: 1 }}
        >
          <span className="relative inline-block">
            ה
            <span
              aria-hidden
              className="absolute -top-[0.34em] left-1/2 h-[0.24em] w-[0.85em] -translate-x-1/2 rounded-[50%]"
              style={{
                border: "1.5px solid #f0b429",
                transform: "translateX(-50%) rotate(-8deg)",
                boxShadow: "0 0 6px rgba(240,180,41,0.8)",
              }}
            />
          </span>
          ילה
        </span>
      )}
    </span>
  );
}
