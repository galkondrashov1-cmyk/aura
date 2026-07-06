import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan, caps } from "@/lib/plans";
import { AppointmentRow } from "@/components/appointment-row";
import { Card } from "@/components/ui";
import { formatHeDate, nowMs } from "@/lib/utils";
import { utcToJerusalemMin } from "@/lib/slots";

export const metadata: Metadata = { title: "יומן תורים" };

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({ where: { id: session.id } });
  if (!biz) redirect("/login");
  const hasBooking = caps(asPlan(biz.plan)).booking;

  const { show } = await searchParams;
  const showPast = show === "past";

  const appts = await prisma.appointment.findMany({
    where: {
      businessId: session.id,
      startsAt: showPast
        ? { lt: new Date(nowMs()) }
        : { gte: new Date(nowMs() - 60 * 60 * 1000) },
    },
    include: { service: true },
    orderBy: { startsAt: showPast ? "desc" : "asc" },
    take: 100,
  });

  // group by Jerusalem calendar date
  const groups = new Map<string, typeof appts>();
  for (const a of appts) {
    const key = utcToJerusalemMin(a.startsAt).dateStr;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">יומן תורים</h1>
          <p className="mt-1 text-sm text-ink-2">
            {biz.autoConfirm
              ? "תורים חדשים מאושרים אוטומטית."
              : "תורים חדשים ממתינים לאישור שלך."}{" "}
            <Link href="/dashboard/settings" className="text-halo hover:underline">
              לשינוי בהגדרות
            </Link>
          </p>
        </div>
        <div className="flex gap-1 rounded-xl bg-night-2 p-1 text-sm font-semibold">
          <Link
            href="/dashboard/appointments"
            className={`rounded-lg px-4 py-2 ${!showPast ? "bg-halo text-night" : "text-ink-2"}`}
          >
            קרובים
          </Link>
          <Link
            href="/dashboard/appointments?show=past"
            className={`rounded-lg px-4 py-2 ${showPast ? "bg-halo text-night" : "text-ink-2"}`}
          >
            היסטוריה
          </Link>
        </div>
      </div>

      {!hasBooking && (
        <div className="rounded-xl border border-viole/30 bg-viole/8 px-4 py-3 text-sm">
          זימון תורים אונליין זמין ב
          <Link href="/dashboard/plan" className="font-bold text-viole hover:underline">
            חבילת עסקים (₪49.99/חודש)
          </Link>
          . עד אז — היומן ריק.
        </div>
      )}

      {groups.size === 0 ? (
        <Card className="p-10 text-center text-sm text-ink-2">
          {showPast ? "אין עדיין היסטוריית תורים." : "אין תורים קרובים."}
        </Card>
      ) : (
        [...groups.entries()].map(([dateStr, list]) => (
          <div key={dateStr}>
            <h2 className="mb-2 text-sm font-bold text-ink-2">
              {formatHeDate(new Date(`${dateStr}T12:00:00Z`))}
            </h2>
            <div className="flex flex-col gap-2">
              {list.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appt={{
                    id: a.id,
                    customerName: a.customerName,
                    customerPhone: a.customerPhone,
                    serviceName: a.service?.name ?? null,
                    startsAt: a.startsAt.toISOString(),
                    status: a.status,
                  }}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
