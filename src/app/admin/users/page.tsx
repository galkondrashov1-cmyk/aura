import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { suspendUser, activateUser, deleteUser } from "@/lib/actions/admin";

type SP = { searchParams: Promise<{ q?: string }> };

export default async function AdminUsers({ searchParams }: SP) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { username: { contains: query } },
            { email: { contains: query } },
            { name: { contains: query } },
          ],
        }
      : undefined,
    include: { _count: { select: { pages: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-text-muted">{users.length} shown</p>
        </div>
        <form className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search users…"
            className="h-10 w-64 rounded-xl border border-border bg-surface-2 pr-4 pl-9 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
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
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                          admin
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-text-muted">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{u._count.pages}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        suspended
                          ? "bg-red-500/15 text-red-400"
                          : "bg-primary/15 text-primary",
                      )}
                    >
                      {suspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={suspended ? activateUser.bind(null, u.id) : suspendUser.bind(null, u.id)}>
                        <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-text">
                          {suspended ? "Activate" : "Suspend"}
                        </button>
                      </form>
                      <form action={deleteUser.bind(null, u.id)}>
                        <button className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-red-400">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
