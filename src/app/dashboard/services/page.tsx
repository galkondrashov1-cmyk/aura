import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { asPlan, caps } from "@/lib/plans";
import { ServicesManager } from "@/components/services-manager";

export const metadata: Metadata = { title: "שירותים" };

export default async function ServicesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    include: { services: { orderBy: { order: "asc" } } },
  });
  if (!biz) redirect("/login");

  const hasBooking = caps(asPlan(biz.plan)).booking;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">שירותים</h1>
        <p className="mt-1 text-sm text-ink-2">
          מה העסק שלך מציע — כל שירות עם משך ומחיר. אלה השירותים שהלקוחות בוחרים כשקובעים תור.
        </p>
      </div>
      {!hasBooking && (
        <div className="rounded-xl border border-viole/30 bg-viole/8 px-4 py-3 text-sm">
          השירותים מוצגים בעמוד שלך — אבל כדי שלקוחות יוכלו <b>לקבוע תור</b> לשירות, צריך את{" "}
          <Link href="/dashboard/plan" className="font-bold text-viole hover:underline">
            חבילת עסקים
          </Link>
          .
        </div>
      )}
      <ServicesManager
        services={biz.services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          durationMin: s.durationMin,
          price: s.price,
          active: s.active,
        }))}
      />
    </div>
  );
}
