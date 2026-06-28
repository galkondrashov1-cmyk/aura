import { prisma } from "@/lib/prisma";

export default async function AdminOverview() {
  const [users, pages, published, views, clicks, recent] = await Promise.all([
    prisma.user.count(),
    prisma.page.count(),
    prisma.page.count({ where: { status: "PUBLISHED" } }),
    prisma.pageView.count(),
    prisma.linkClick.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, username: true, email: true, status: true, createdAt: true },
    }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-text-muted">Platform health at a glance.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Metric label="Users" value={users} />
        <Metric label="Pages" value={pages} />
        <Metric label="Published" value={published} />
        <Metric label="Total views" value={views} />
        <Metric label="Total clicks" value={clicks} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <p className="mb-4 text-sm font-medium">Newest users</p>
        <div className="space-y-2">
          {recent.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5 text-sm"
            >
              <div className="min-w-0">
                <span className="truncate">@{u.username}</span>
                <span className="ml-2 text-text-muted">{u.email}</span>
              </div>
              <span className="shrink-0 text-xs text-text-muted">
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium">{value.toLocaleString()}</p>
    </div>
  );
}
