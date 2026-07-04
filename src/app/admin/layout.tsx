import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuraLogo } from "@/components/aura-logo";
import { getSession } from "@/lib/session";
import { isAdminUnlocked } from "@/lib/admin-gate";
import { AdminUnlock } from "@/components/admin/admin-unlock";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  // Second factor: admins must also enter the admin code.
  if (!(await isAdminUnlocked())) return <AdminUnlock />;

  return (
    <div data-mode="muted" className="min-h-screen bg-bg text-text">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border px-4 py-5 md:flex">
          <Link href="/" className="px-2">
            <AuraLogo />
          </Link>
          <span className="mt-3 px-2 text-xs font-medium tracking-wide text-primary uppercase">
            Admin
          </span>

          <AdminNav />

          <Link
            href="/dashboard"
            className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
            Back to app
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header + tab nav */}
          <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AuraLogo />
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">
                  Admin
                </span>
              </div>
              <Link
                href="/dashboard"
                aria-label="Back to app"
                className="grid h-9 w-9 place-items-center rounded-xl text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Link>
            </div>
            <AdminNav orientation="horizontal" />
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 md:px-10 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
