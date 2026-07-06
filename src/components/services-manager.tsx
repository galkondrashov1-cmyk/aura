"use client";

import { useActionState, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  deleteService,
  moveService,
  toggleService,
  upsertService,
  type ServiceState,
} from "@/lib/actions/services";
import { Badge, Button, Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

export type ServiceView = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number | null;
  active: boolean;
};

export function ServicesManager({ services }: { services: ServiceView[] }) {
  const [editing, setEditing] = useState<ServiceView | "new" | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {services.length === 0 && !editing && (
        <div className="card p-8 text-center text-sm text-ink-2">
          עדיין אין שירותים. למשל: ״תספורת — 30 דק׳ — ₪80״.
        </div>
      )}

      {services.map((s, i) => (
        <div key={s.id} className={cn("card flex flex-wrap items-center justify-between gap-3 p-4", !s.active && "opacity-55")}>
          <div className="min-w-0">
            <p className="font-bold">
              {s.name} {!s.active && <Badge tone="gray">מוסתר</Badge>}
            </p>
            <p className="mt-0.5 text-sm text-ink-2">
              {s.durationMin} דק׳{s.price != null && ` · ₪${s.price}`}
              {s.description && ` · ${s.description}`}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <RowButton title="למעלה" disabled={i === 0} onClick={() => moveService(s.id, -1)}>
              <ArrowUp className="h-4 w-4" />
            </RowButton>
            <RowButton title="למטה" disabled={i === services.length - 1} onClick={() => moveService(s.id, 1)}>
              <ArrowDown className="h-4 w-4" />
            </RowButton>
            <RowButton title={s.active ? "הסתרה" : "הצגה"} onClick={() => toggleService(s.id, !s.active)}>
              {s.active ? "🙈" : "👁️"}
            </RowButton>
            <RowButton title="עריכה" onClick={() => setEditing(s)}>
              <Pencil className="h-4 w-4" />
            </RowButton>
            <RowButton
              title="מחיקה"
              danger
              onClick={() => {
                if (confirm(`למחוק את «${s.name}»?`)) return deleteService(s.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </RowButton>
          </div>
        </div>
      ))}

      {editing ? (
        <ServiceForm service={editing === "new" ? null : editing} onDone={() => setEditing(null)} />
      ) : (
        <Button onClick={() => setEditing("new")} className="self-start">
          <Plus className="h-4 w-4" /> שירות חדש
        </Button>
      )}
    </div>
  );
}

function RowButton({
  children,
  onClick,
  title,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void | Promise<void>;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      title={title}
      disabled={disabled || pending}
      onClick={() => startTransition(async () => void (await onClick()))}
      className={cn(
        "rounded-lg border border-line p-2 text-ink-2 transition cursor-pointer hover:text-ink hover:border-white/25 disabled:opacity-35 disabled:pointer-events-none",
        danger && "hover:border-red-400/50 hover:text-red-400",
      )}
    >
      {children}
    </button>
  );
}

function ServiceForm({ service, onDone }: { service: ServiceView | null; onDone: () => void }) {
  const [state, action, pending] = useActionState<ServiceState, FormData>(
    async (prev, fd) => {
      const res = await upsertService(prev, fd);
      if (!res?.error) onDone();
      return res;
    },
    null,
  );

  return (
    <form action={action} className="card flex flex-col gap-4 border-halo/30 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{service ? "עריכת שירות" : "שירות חדש"}</h3>
        <button type="button" onClick={onDone} className="rounded-lg p-1.5 text-ink-2 hover:text-ink cursor-pointer">
          <X className="h-4 w-4" />
        </button>
      </div>
      {state?.error && (
        <p className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">{state.error}</p>
      )}
      {service && <input type="hidden" name="id" value={service.id} />}
      <div>
        <Label htmlFor="s-name">שם השירות</Label>
        <Input id="s-name" name="name" defaultValue={service?.name} placeholder="תספורת נשים" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-duration">משך (דקות)</Label>
          <Input id="s-duration" name="durationMin" type="number" min={5} max={600} step={5} defaultValue={service?.durationMin ?? 30} required />
        </div>
        <div>
          <Label htmlFor="s-price">מחיר בש״ח (לא חובה)</Label>
          <Input id="s-price" name="price" type="number" min={0} defaultValue={service?.price ?? ""} placeholder="80" />
        </div>
      </div>
      <div>
        <Label htmlFor="s-desc">תיאור קצר (לא חובה)</Label>
        <Input id="s-desc" name="description" defaultValue={service?.description ?? ""} maxLength={200} placeholder="כולל חפיפה וייבוש" />
      </div>
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "שומרים…" : "שמירה"}
      </Button>
    </form>
  );
}
