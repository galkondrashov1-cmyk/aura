import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { nowMs } from "@/lib/utils";
import { Card } from "@/components/ui";
import { BusinessTable } from "@/components/admin/business-table";

export const metadata: Metadata = { title: "פאנל ניהול" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = (q ?? "").trim();
  const monthAgo = new Date(nowMs() - 30 * 24 * 60 * 60 * 1000);

  const [total, published, suspended, apptsUpcoming, apptsTotal, visits30, byPlan, businesses] =
    await Promise.all([
      prisma.business.count(),
      prisma.site.count({ where: { published: true } }),
      prisma.business.count({ where: { status: "SUSPENDED" } }),
      prisma.appointment.count({
        where: { status: { in: ["PENDING", "CONFIRMED"] }, startsAt: { gte: new Date(nowMs()) } },
      }),
      prisma.appointment.count(),
      prisma.visit.count({ where: { createdAt: { gte: monthAgo } } }),
      prisma.business.groupBy({ by: ["plan"], _count: true }),
      prisma.business.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { ownerName: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        include: {
          site: { select: { published: true } },
          _count: { select: { appointments: true, visits: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

  const planCount = (p: string) => byPlan.find((x) => x.plan === p)?._count ?? 0;
  const paying = planCount("DESIGN") + planCount("BUSINESS");
  const mrr = planCount("DESIGN") * 9.9 + planCount("BUSINESS") * 49.99;

  const stats = [
    { label: "עסקים רשומים", value: total, hint: `${suspended} מושעים` },
    { label: "עמודים באוויר", value: published, hint: "" },
    { label: "מנויים בתשלום", value: paying, hint: `≈ ₪${mrr.toFixed(0)} לחודש (דמו)` },
    { label: "תורים קרובים", value: apptsUpcoming, hint: `${apptsTotal} סה״כ` },
    { label: "צפיות (30 יום)", value: visits30, hint: "" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">שלום, המנהל 👑</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-2xl font-extrabold text-halo">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-ink-2">{s.label}</p>
            {s.hint && <p className="mt-0.5 text-[10px] text-ink-2/70">{s.hint}</p>}
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            עסקים {search && <span className="text-sm font-normal text-ink-2">— חיפוש: “{search}”</span>}
          </h2>
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={search}
              placeholder="חיפוש לפי שם / אימייל / כתובת…"
              className="w-64 rounded-xl border border-line bg-night-3 px-3.5 py-2 text-sm text-ink placeholder:text-ink-2/60 outline-none focus:border-halo/60"
            />
            <button className="rounded-xl bg-halo px-4 py-2 text-sm font-bold text-night hover:bg-halo-2 cursor-pointer">
              חיפוש
            </button>
          </form>
        </div>
        <BusinessTable
          businesses={businesses.map((b) => ({
            id: b.id,
            name: b.name,
            ownerName: b.ownerName,
            email: b.email,
            slug: b.slug,
            plan: b.plan,
            role: b.role,
            status: b.status,
            published: b.site?.published ?? false,
            appointments: b._count.appointments,
            visits: b._count.visits,
            createdAt: b.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
