import Link from "next/link";
import { Plus, ExternalLink, Pencil } from "lucide-react";
import { AuraMark } from "@/components/aura-logo";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createPage } from "@/lib/actions/pages";
import { CopyLinkButton } from "@/components/copy-link-button";

export default async function DashboardHome() {
  const session = await getSession();
  const pages = session
    ? await prisma.page.findMany({
        where: { userId: session.id },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">My pages</h1>
          <p className="mt-1 text-sm text-text-muted">
            Create and manage your AURA pages.
          </p>
        </div>
        <form action={createPage}>
          <button type="submit" className={buttonClasses("primary", "md")}>
            <Plus className="h-4 w-4" />
            New page
          </button>
        </form>
      </div>

      {pages.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-20 text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-surface-2 text-primary">
            <AuraMark className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-medium">Create your first AURA</h2>
          <p className="mt-2 max-w-sm text-sm text-text-muted">
            Build your page from scratch and make it yours with the design studio.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <form action={createPage}>
              <button type="submit" className={buttonClasses("primary", "md")}>
                <Plus className="h-4 w-4" />
                Create a page
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const published = page.status === "PUBLISHED";
            return (
              <div
                key={page.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-primary">
                    <AuraMark className="h-6 w-6" />
                  </div>
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
                </div>

                <p className="mt-4 font-display text-base font-medium">{page.title}</p>
                <p className="truncate text-xs text-text-muted">
                  useaura.me/{session?.username}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/builder/${page.id}`}
                    className={buttonClasses("secondary", "sm", "flex-1")}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <CopyLinkButton url={`https://useaura.me/${session?.username}`} />
                  {published && (
                    <Link
                      href={`/${session?.username}`}
                      target="_blank"
                      className={buttonClasses("ghost", "sm")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
