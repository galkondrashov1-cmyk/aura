import { BRAND } from "@/lib/brand";
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
      <h1 className="font-display text-[2rem] leading-tight font-bold tracking-tight">עמודים</h1>
      <p className="mt-1 text-sm text-text-muted">{pages.length} shown</p>

      {/* Mobile: stacked cards */}
      <div className="mt-5 space-y-3 md:hidden">
        {pages.map((p) => {
          const published = p.status === "PUBLISHED";
          return (
            <div key={p.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.title}</p>
                  <p className="truncate text-xs text-text-muted">
                    {BRAND.domain}/{p.user.username}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    published ? "bg-primary/15 text-primary-text" : "bg-surface-2 text-text-muted",
                  )}
                >
                  {published ? "פורסם" : "טיוטה"}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                עודכן {new Date(p.updatedAt).toLocaleDateString("he-IL")}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={`/d/${signDraft(p.id)}`}
                  target="_blank"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-text"
                >
                  <Eye className="h-3.5 w-3.5" />
                  טיוטה
                </Link>
                {published && (
                  <Link
                    href={`/${p.user.username}`}
                    target="_blank"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs text-text-muted transition-colors hover:text-text"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    באוויר
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {pages.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-text-muted">
            עוד אין עמודים.
          </p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="mt-6 hidden overflow-x-auto rounded-lg border border-border md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-start text-xs text-text-muted">
              <th className="px-4 py-3 font-medium">כותרת</th>
              <th className="px-4 py-3 font-medium">בעלים</th>
              <th className="px-4 py-3 font-medium">סטטוס</th>
              <th className="px-4 py-3 font-medium">עודכן</th>
              <th className="px-4 py-3 text-end font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => {
              const published = p.status === "PUBLISHED";
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {BRAND.domain}/{p.user.username}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        published
                          ? "bg-primary/15 text-primary-text"
                          : "bg-surface-2 text-text-muted",
                      )}
                    >
                      {published ? "פורסם" : "טיוטה"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(p.updatedAt).toLocaleDateString("he-IL")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/d/${signDraft(p.id)}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text"
                        title="צפייה בטיוטה של המשתמש"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        טיוטה
                      </Link>
                      {published && (
                        <Link
                          href={`/${p.user.username}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          באוויר
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
                  עוד אין עמודים.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
