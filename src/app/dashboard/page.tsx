import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, CalendarCheck, Hourglass, Rocket, Paintbrush, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan, caps, planInfo } from "@/lib/plans";
import { Badge, Card } from "@/components/ui";
import { nowMs } from "@/lib/utils";
import { CopyLinkButton, PublishToggle } from "@/components/dashboard-bits";
import { AppointmentRow } from "@/components/appointment-row";
import { todayStr, jerusalemToUtc } from "@/lib/slots";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    include: { site: true },
  });
  if (!biz) redirect("/login");

  const plan = asPlan(biz.plan);
  const c = caps(plan);
  const today = todayStr();
  const dayStart = jerusalemToUtc(today, 0);
  const dayEnd = jerusalemToUtc(today, 24 * 60);
  const monthAgo = new Date(nowMs() - 30 * 24 * 60 * 60 * 1000);

  const [visits30, apptsToday, pending, upcoming] = await Promise.all([
    prisma.visit.count({ where: { businessId: biz.id, createdAt: { gte: monthAgo } } }),
    prisma.appointment.count({
      where: {
        businessId: biz.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { gte: dayStart, lt: dayEnd },
      },
    }),
    prisma.appointment.findMany({
      where: { businessId: biz.id, status: "PENDING", startsAt: { gte: new Date() } },
      include: { service: true },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { businessId: biz.id, status: "CONFIRMED", startsAt: { gte: new Date() } },
      include: { service: true },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
  ]);

  const published = biz.site?.published ?? false;
  const info = planInfo(plan);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">שלום, {biz.ownerName} 👋</h1>
          <p className="mt-1 text-sm text-ink-2">
            {biz.name} · <Badge tone={plan === "FREE" ? "gray" : plan === "DESIGN" ? "gold" : "violet"}>חבילת {info.name}</Badge>
          </p>
        </div>
        <PublishToggle published={published} />
      </div>

      {/* page link */}
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-2">הכתובת של העמוד שלך</p>
          <p className="mt-0.5 font-mono text-sm text-halo" dir="ltr">/{biz.slug}</p>
          {!published && (
            <p className="mt-1 text-xs text-yellow-500/90">
              העמוד עדיין טיוטה — פרסמו אותו כדי שהלקוחות יוכלו לראות.
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <CopyLinkButton slug={biz.slug} />
          <a
            href={`/${biz.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
          >
            צפה בהילה שלך
          </a>
        </div>
      </Card>

      {/* stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <Eye className="mx-auto h-6 w-6 text-halo" strokeWidth={1.75} />
          <p className="mt-2 text-2xl font-extrabold">{visits30}</p>
          <p className="text-xs text-ink-2">צפיות (30 יום)</p>
        </Card>
        <Card className="text-center">
          <CalendarCheck className="mx-auto h-6 w-6 text-mint" strokeWidth={1.75} />
          <p className="mt-2 text-2xl font-extrabold">{apptsToday}</p>
          <p className="text-xs text-ink-2">תורים היום</p>
        </Card>
        <Card className="text-center">
          <Hourglass className="mx-auto h-6 w-6 text-viole" strokeWidth={1.75} />
          <p className="mt-2 text-2xl font-extrabold">{pending.length}</p>
          <p className="text-xs text-ink-2">ממתינים לאישור</p>
        </Card>
      </div>

      {/* pending approvals */}
      {pending.length > 0 && (
        <Card>
          <h2 className="mb-3 font-bold">תורים שממתינים לאישור שלך</h2>
          <div className="flex flex-col gap-2">
            {pending.map((a) => (
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
        </Card>
      )}

      {/* upcoming */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">התורים הקרובים</h2>
          <Link href="/dashboard/appointments" className="flex items-center gap-1 text-sm text-halo hover:underline">
            ליומן המלא <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink-2">
            {c.booking
              ? "אין תורים קרובים. שתפו את הקישור שלכם כדי שלקוחות יתחילו לקבוע."
              : "זימון תורים זמין בחבילת עסקים."}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((a) => (
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
        )}
      </Card>

      {/* quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/editor" className="card group flex items-center gap-4 p-5 transition hover:border-halo/40">
          <Paintbrush className="h-8 w-8 text-halo" strokeWidth={1.5} />
          <div>
            <p className="font-bold group-hover:text-halo">עיצוב העמוד</p>
            <p className="text-sm text-ink-2">תוכן, צבעים, רקעים ופונטים</p>
          </div>
        </Link>
        {!c.booking && (
          <Link href="/dashboard/plan" className="card group flex items-center gap-4 p-5 transition hover:border-viole/40">
            <Rocket className="h-8 w-8 text-viole" strokeWidth={1.5} />
            <div>
              <p className="font-bold group-hover:text-viole">רוצים לקבל תורים אונליין?</p>
              <p className="text-sm text-ink-2">שדרגו לחבילת עסקים — ₪49.99/חודש</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
