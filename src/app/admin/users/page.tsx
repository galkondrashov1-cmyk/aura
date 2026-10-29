import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { suspendUser, activateUser, deleteUser } from "@/lib/actions/admin";
import { PlanSelect } from "@/components/admin/plan-select";
import { asPlan } from "@/lib/plans";
import { ConfirmSubmit } from "@/components/confirm-submit";
import Link from "next/link";

type SP = { searchParams: Promise<{ q?: string }> };

export default async function AdminUsers({ searchParams }: SP) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { username: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { _count: { select: { pages: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // The generated client may lag the `plan` column locally; read it raw.
  const planRows = await prisma.$queryRaw<{ id: string; plan: string | null }[]>`
    SELECT id, plan FROM "User"
  `;
  const planById = new Map(planRows.map((r) => [r.id, asPlan(r.plan)]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">משתמשים</h1>
          <p className="mt-1 text-sm text-text-muted">{users.length} shown</p>
        </div>
        <form className="relative w-full sm:w-auto">
          <Search className="pointer-events-none absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            name="q"
            defaultValue={query}
            placeholder="חיפוש משתמשים…"
            className="h-10 w-full rounded-xl border border-border bg-surface-2 pe-4 ps-9 text-sm text-text placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none sm:w-64"
          />
        </form>
      </div>

      {/* Mobile: stacked cards — every action reachable without side-scrolling */}
      <div className="mt-5 space-y-3 md:hidden">
        {users.map((u) => {
          const suspended = u.status === "SUSPENDED";
          return (
            <div key={u.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span className="truncate">@{u.username}</span>
                    {u.role === "ADMIN" && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary-text">
                        admin
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-text-muted">{u.email}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    suspended ? "bg-red-500/15 text-red-700" : "bg-primary/15 text-primary-text",
                  )}
                >
                  {suspended ? "מושעה" : "פעיל"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                <span>{u._count.pages} עמודים</span>
                <span>·</span>
                <span>הצטרף {new Date(u.createdAt).toLocaleDateString("he-IL")}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <PlanSelect userId={u.id} plan={planById.get(u.id) ?? "FREE"} />
                <form
                  className="flex-1"
                  action={suspended ? activateUser.bind(null, u.id) : suspendUser.bind(null, u.id)}
                >
                  <button className="w-full rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-text">
                    {suspended ? "הפעלה" : "השעיה"}
                  </button>
                </form>
                <Link
                  href={`/admin/users/reset?id=${u.id}`}
                  className="flex-1 rounded-lg border border-border py-2 text-center text-xs text-text-muted transition-colors hover:text-text"
                >
                  קישור איפוס
                </Link>
                <form className="flex-1" action={deleteUser.bind(null, u.id)}>
                  <ConfirmSubmit
                    message={`למחוק את @${u.username} ואת כל העמודים שלו? אי אפשר לבטל.`}
                    className="w-full rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-red-700"
                  >
                    מחיקה
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          );
        })}
        {users.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">
            לא נמצאו משתמשים.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-start text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">משתמש</th>
              <th className="px-4 py-3 font-medium">עמודים</th>
              <th className="px-4 py-3 font-medium">חבילה</th>
              <th className="px-4 py-3 font-medium">סטטוס</th>
              <th className="px-4 py-3 font-medium">הצטרף</th>
              <th className="px-4 py-3 text-end font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const suspended = u.status === "SUSPENDED";
              return (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="truncate">@{u.username}</span>
                      {u.role === "ADMIN" && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary-text">
                          admin
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-text-muted">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{u._count.pages}</td>
                  <td className="px-4 py-3">
                    <PlanSelect userId={u.id} plan={planById.get(u.id) ?? "FREE"} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        suspended
                          ? "bg-red-500/15 text-red-700"
                          : "bg-primary/15 text-primary-text",
                      )}
                    >
                      {suspended ? "מושעה" : "פעיל"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={suspended ? activateUser.bind(null, u.id) : suspendUser.bind(null, u.id)}>
                        <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-text">
                          {suspended ? "הפעלה" : "השעיה"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/users/reset?id=${u.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-text"
                      >
                        קישור איפוס
                      </Link>
                      <form action={deleteUser.bind(null, u.id)}>
                        <ConfirmSubmit
                          message={`למחוק את @${u.username} ואת כל העמודים שלו? אי אפשר לבטל.`}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-red-700"
                        >
                          מחיקה
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-text-muted">
                  לא נמצאו משתמשים.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
