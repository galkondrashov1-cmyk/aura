import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard-nav";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/actions/auth";
import { PlanNotice } from "@/components/dashboard/plan-notice";

// Per-user, always fresh — never prerendered at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const initials = (user.name ?? user.username).slice(0, 2).toUpperCase();

  return (
    <div data-mode="muted" className="min-h-screen bg-bg text-text">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-60 shrink-0 flex-col border-e border-border px-4 py-5 md:flex">
          <Link href="/" className="px-2">
            <Logo />
          </Link>

          <DashboardNav isAdmin={user.role === "ADMIN"} />

          <div className="mt-auto space-y-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-xs text-primary-text">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm">{user.name ?? user.username}</p>
                <p className="truncate text-xs text-text-muted">
                  {BRAND.domain}/{user.username}
                </p>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <LogOut className="h-[18px] w-[18px]" />
                התנתקות
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <Link href="/">
                <Logo />
              </Link>
              <div className="flex items-center gap-1">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    aria-label="התנתקות"
                    className="grid h-9 w-9 place-items-center rounded-xl text-text-muted transition-colors hover:bg-surface hover:text-text"
                  >
                    <LogOut className="h-[18px] w-[18px]" />
                  </button>
                </form>
              </div>
            </div>
            <DashboardNav orientation="horizontal" isAdmin={user.role === "ADMIN"} />
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 md:px-10 md:py-8">
            <PlanNotice user={user} />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
