"use client";

import { useTransition } from "react";
import { Check, X, Phone } from "lucide-react";
import { setAppointmentStatus } from "@/lib/actions/appointments";
import { formatHeDate, formatHeTime, formatPhone } from "@/lib/utils";
import { Badge } from "@/components/ui";

export type ApptView = {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string | null;
  startsAt: string; // ISO
  status: string;
};

export function AppointmentRow({ appt }: { appt: ApptView }) {
  const [pending, startTransition] = useTransition();
  const d = new Date(appt.startsAt);
  const isPending = appt.status === "PENDING";
  const isCancelled = appt.status === "CANCELLED";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-night-3 px-4 py-3 ${isCancelled ? "opacity-50" : ""}`}
    >
      <div className="min-w-0">
        <p className="font-semibold">
          {appt.customerName}
          {appt.serviceName && <span className="text-ink-2"> · {appt.serviceName}</span>}
        </p>
        <p className="mt-0.5 text-sm text-ink-2">
          {formatHeDate(d)} · {formatHeTime(d)} ·{" "}
          <a href={`tel:${appt.customerPhone}`} className="inline-flex items-center gap-1 hover:text-ink" dir="ltr">
            <Phone className="h-3 w-3" />
            {formatPhone(appt.customerPhone)}
          </a>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isPending && <Badge tone="gold">ממתין</Badge>}
        {appt.status === "CONFIRMED" && <Badge tone="green">מאושר</Badge>}
        {isCancelled && <Badge tone="red">בוטל</Badge>}
        {!isCancelled && (
          <>
            {isPending && (
              <button
                disabled={pending}
                onClick={() => startTransition(() => setAppointmentStatus(appt.id, "CONFIRMED"))}
                className="rounded-lg bg-mint/15 p-2 text-mint hover:bg-mint/25 cursor-pointer disabled:opacity-50"
                title="אישור התור"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            <button
              disabled={pending}
              onClick={() => {
                if (confirm("לבטל את התור?")) {
                  startTransition(() => setAppointmentStatus(appt.id, "CANCELLED"));
                }
              }}
              className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 cursor-pointer disabled:opacity-50"
              title="ביטול התור"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
