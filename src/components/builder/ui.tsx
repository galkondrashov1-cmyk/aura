"use client";

// Small, consistent controls shared by the design panel and block editors.
import { createContext, useContext, useRef, useState } from "react";
import { ImagePlus, Loader2, Lock, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_RANK, type Plan } from "@/lib/plans";
import { uploadImage } from "@/lib/client-image";

export const fieldCls =
  "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted focus-visible:border-text focus-visible:outline-none";

export function Label({ children, hint }: { children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-text-muted">
      {children}
      {hint && <span className="font-normal text-text-muted/70">· {hint}</span>}
    </p>
  );
}

export function TierPill({ tier }: { tier: Plan }) {
  if (tier === "FREE") return null;
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-px text-[9px] font-semibold tracking-wide text-primary-text uppercase">
      <Lock className="h-2 w-2" />
      {tier === "PRO" ? "Pro" : "Plus"}
    </span>
  );
}

/** Provided by the editor: opens the in-editor upgrade sheet (no navigation, nothing lost). */
export const UpgradeContext = createContext<{ openUpsell: (tier: Plan) => void }>({
  openUpsell: () => window.open("/dashboard/upgrade", "_blank"),
});

export function useLocked(plan: Plan) {
  const { openUpsell } = useContext(UpgradeContext);
  return {
    isLocked: (tier: Plan) => PLAN_RANK[tier] > PLAN_RANK[plan],
    upgrade: (tier: Plan = "PLUS") => openUpsell(tier),
  };
}

/** Segmented control for a handful of options. */
export function Seg<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T | undefined;
  options: { id: T; label: React.ReactNode; title?: string }[];
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex rounded-xl border border-border bg-surface-2 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.title}
          onClick={() => onChange(o.id)}
          className={cn(
            "flex flex-1 items-center justify-center gap-1 rounded-[10px] px-2 py-1.5 text-xs whitespace-nowrap transition-colors",
            value === o.id ? "bg-bg text-text shadow-sm ring-1 ring-border" : "text-text-muted hover:text-text",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Grid of named choices with plan locks. */
export function Chips({
  value,
  options,
  plan,
  onChange,
  cols = 3,
  render,
}: {
  value: string | undefined;
  options: { id: string; name: string; tier?: Plan; hint?: string }[];
  plan: Plan;
  onChange: (id: string) => void;
  cols?: 2 | 3 | 4;
  render?: (o: { id: string; name: string }) => React.ReactNode;
}) {
  const { isLocked } = useLocked(plan);
  return (
    <div className={cn("grid gap-1.5", cols === 2 ? "grid-cols-2" : cols === 4 ? "grid-cols-4" : "grid-cols-3")}>
      {options.map((o) => {
        const locked = isLocked(o.tier ?? "FREE");
        return (
          <button
            key={o.id}
            type="button"
            title={o.hint}
            onClick={() => onChange(o.id)}
            className={cn(
              "relative flex min-h-10 flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center text-xs transition-colors",
              value === o.id ? "border-primary bg-primary/10 text-text" : "border-border bg-surface-2 text-text-muted hover:text-text",
            )}
          >
            {render ? render(o) : <span className="leading-tight">{o.name}</span>}
            {o.tier && o.tier !== "FREE" && locked && (
              <span className="absolute top-1 end-1">
                <TierPill tier={o.tier} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ColorField({
  value,
  fallback,
  onChange,
  onReset,
  label,
}: {
  value?: string;
  fallback: string;
  onChange: (v: string) => void;
  onReset?: () => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || fallback}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-11 shrink-0 cursor-pointer rounded-lg border border-border bg-surface-2"
        aria-label={label ?? "בחירת צבע"}
      />
      <input
        type="text"
        defaultValue={value ?? ""}
        key={value}
        placeholder={fallback}
        onBlur={(e) => {
          const v = e.target.value.trim();
          if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
        }}
        className="h-9 w-24 rounded-lg border border-border bg-surface-2 px-2.5 font-mono text-xs text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
        aria-label={`קוד hex של ${label ?? "הצבע"}`}
      />
      {value && onReset && (
        <button type="button" onClick={onReset} className="text-xs text-text-muted hover:text-text">
          איפוס
        </button>
      )}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
  label,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  suffix?: string;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 text-xs text-text-muted">
      <span className="w-14 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-primary"
      />
      <span className="w-12 text-end tabular-nums">
        {value}
        {suffix}
      </span>
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm text-text"
    >
      <span className="text-start">{label}</span>
      <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", checked ? "bg-primary" : "bg-border")}>
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "start-[18px]" : "start-0.5",
          )}
        />
      </span>
    </button>
  );
}

/** URL field + upload button + thumbnail, for any image slot. */
export function ImageField({
  value,
  onChange,
  placeholder = "הדביקו קישור לתמונה או העלו",
  maxDim,
}: {
  value?: string | null;
  onChange: (url: string | undefined) => void;
  placeholder?: string;
  maxDim?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, maxDim));
    } catch (err) {
      setError(err instanceof Error ? err.message : "ההעלאה נכשלה");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover" />
        ) : (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-dashed border-border text-text-muted">
            <ImagePlus className="h-4 w-4" />
          </span>
        )}
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          placeholder={placeholder}
          className={cn(fieldCls, "min-w-0 flex-1")}
        />
        <input ref={ref} type="file" accept="image/*" onChange={onPick} className="hidden" />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="grid h-10 shrink-0 place-items-center rounded-xl border border-border px-3 text-sm text-text-muted transition-colors hover:text-text disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "העלאה"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="הסרת תמונה"
            className="grid h-10 w-8 shrink-0 place-items-center text-text-muted hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <div className="relative space-y-2 rounded-xl border border-border bg-surface-2/60 p-2.5">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="הסרת פריט"
          className="absolute top-2 end-2 grid h-7 w-7 place-items-center rounded-lg text-text-muted transition-colors hover:bg-bg hover:text-red-700"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      {children}
    </div>
  );
}

export function AddItem({ onClick, label = "הוספת פריט" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-text"
    >
      <Plus className="h-4 w-4" /> {label}
    </button>
  );
}

export function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">{title}</p>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-t-xl border border-border bg-bg shadow-2xl sm:rounded-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <p className="font-display text-base font-medium">{title}</p>
          <button onClick={onClose} aria-label="סגירה" className="text-text-muted hover:text-text">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
