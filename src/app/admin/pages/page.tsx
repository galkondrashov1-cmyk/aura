import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
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
                  <td className="px-4 py-3 text-right">
                    {published && (
                      <Link
                        href={`/${p.user.username}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                    )}
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
