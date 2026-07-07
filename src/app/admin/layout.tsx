import { redirect } from "next/navigation";
import Link from "next/link";
import { checkAdmin } from "@/lib/admin";
import { HilaLogo } from "@/components/ui";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const check = await checkAdmin();
  if (!check.ok) {
    if (check.reason === "no-session") redirect("/login");
    if (check.reason === "not-admin") redirect("/dashboard");
    redirect("/admin-gate"); // has a session + ADMIN role, missing the code
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-night-2/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <HilaLogo size={24} />
            </Link>
            <span className="rounded-full bg-viole/15 px-2.5 py-0.5 text-xs font-bold text-viole">
              פאנל ניהול
            </span>
          </div>
          <Link href="/dashboard" className="text-sm text-ink-2 transition hover:text-ink">
            ← חזרה לדשבורד
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
