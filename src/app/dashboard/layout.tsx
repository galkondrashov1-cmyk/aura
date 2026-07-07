import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const biz = await prisma.business.findUnique({
    where: { id: session.id },
    select: { role: true, slug: true, name: true },
  });
  if (!biz) redirect("/login");

  return (
    <div className="min-h-dvh">
      <DashboardNav slug={biz.slug} businessName={biz.name} isAdmin={biz.role === "ADMIN"} />
      <main className="px-4 pb-24 pt-6 sm:px-6 lg:mr-60 lg:pb-10">{children}</main>
    </div>
  );
}
