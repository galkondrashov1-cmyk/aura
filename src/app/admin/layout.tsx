import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, FileText, ArrowLeft } from "lucide-react";
import { AuraLogo } from "@/components/aura-logo";
import { getSession } from "@/lib/session";
import { isAdminUnlocked } from "@/lib/admin-gate";
import { AdminUnlock } from "@/components/admin/admin-unlock";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/pages", label: "Pages", icon: FileText },
];

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
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border px-4 py-5 md:flex">
          <Link href="/" className="px-2">
            <AuraLogo />
          </Link>
          <span className="mt-3 px-2 text-xs font-medium tracking-wide text-primary uppercase">
            Admin
          </span>

          <nav className="mt-6 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/dashboard"
            className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface hover:text-text"
          >
            <ArrowLeft className="h-[18px] w-[18px] " />
            Back to app
          </Link>
        </aside>

        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">{children}</main>
      </div>
    </div>
  );
}
