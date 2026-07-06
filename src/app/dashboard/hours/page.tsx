import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { HoursForm } from "@/components/hours-form";

export const metadata: Metadata = { title: "שעות פעילות" };

export default async function HoursPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const hours = await prisma.workingHour.findMany({
    where: { businessId: session.id },
    orderBy: { day: "asc" },
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-extrabold">שעות פעילות</h1>
        <p className="mt-1 text-sm text-ink-2">
          לפי השעות האלה מוצגות ללקוחות המשבצות הפנויות בקביעת תור, והן מופיעות גם בעמוד שלך.
        </p>
      </div>
      <HoursForm
        initial={hours.map((h) => ({ day: h.day, startMin: h.startMin, endMin: h.endMin }))}
      />
    </div>
  );
}
