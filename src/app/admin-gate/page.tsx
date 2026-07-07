import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { HilaLogo } from "@/components/ui";
import { AdminGateForm } from "@/components/admin/gate-form";

export const metadata: Metadata = { title: "פאנל ניהול" };

export default async function AdminGatePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    select: { role: true },
  });
  if (biz?.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4">
      <div className="halo-orb pointer-events-none right-[14%] top-[12%] h-64 w-64" style={{ background: "#8b7cf6", opacity: 0.22 }} />
      <div className="relative mb-8">
        <HilaLogo size={38} />
      </div>
      <div className="card w-full max-w-sm p-7 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-viole/12 text-2xl">
          🔐
        </div>
        <h1 className="text-xl font-extrabold">פאנל הניהול של הילה</h1>
        <p className="mb-6 mt-1 text-sm text-ink-2">
          שלום {session.ownerName} — נדרש קוד גישה נוסף.
        </p>
        <AdminGateForm />
      </div>
    </div>
  );
}
