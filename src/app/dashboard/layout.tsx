import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh">
      <DashboardNav slug={session.slug} businessName={session.name} />
      <main className="px-4 pb-24 pt-6 sm:px-6 lg:mr-60 lg:pb-10">{children}</main>
    </div>
  );
}
