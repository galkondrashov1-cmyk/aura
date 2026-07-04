import Link from "next/link";
import { ExternalLink, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { signDraft } from "@/lib/draft-token";

export default async function AdminPages() {
  const pages = await prisma.page.findMany({
    include: { user: { select: { username: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Pages</h1>
      <p className="mt-1 text-sm text-text-muted">{pages.length} shown</p>

      {/* Mobile: stacked cards */}
      <div className="mt-5 space-y-3 md:hidden">
        {pages.map((p) => {
          const published = p.status === "PUBLISHED";
          return (
            <div key={p.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="truncate text-xs text-text-muted">
                    useaura.me/{p.user.username}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    published ? "bg-primary/15 text-primary" : "bg-surface-2 text-text-muted",
                  )}
                >
                  {published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Updated {new Date(p.updatedAt).toLocaleDateString()}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/d/${signDraft(p.id)}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-text"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Draft
                </Link>
                {published && (
                  <Link
                    href={`/${p.user.username}`}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-text"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Live
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {pages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
            No pages yet.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 text-right font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => {
              const published = p.status === "PUBLISHED";
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-text-muted">
                    useaura.me/{p.user.username}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        published
                          ? "bg-primary/15 text-primary"
                          : "bg-surface-2 text-text-muted",
                      )}
                    >
                      {published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/d/${signDraft(p.id)}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text"
                        title="View this user's draft"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Draft
                      </Link>
                      {published && (
                        <Link
                          href={`/${p.user.username}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">
                  No pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
