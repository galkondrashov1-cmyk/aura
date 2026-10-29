import Link from "next/link";
import { Plus, ExternalLink, Pencil, Eye, MousePointerClick, Copy, Crown } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { asPageContent } from "@/lib/blocks";
import { getEffectivePlan } from "@/lib/plan-source";
import { duplicatePage, setPrimaryPage } from "@/lib/actions/pages";
import { CopyLinkButton } from "@/components/copy-link-button";
import { PageThumb } from "@/components/dashboard/page-thumb";
import { TemplateGallery } from "@/components/dashboard/template-gallery";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export default async function DashboardHome() {
  const session = await getSession();
  if (!session) return null;
  const [pages, plan] = await Promise.all([
    prisma.page.findMany({
      where: { userId: session.id },
      orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
      select: { id: true, title: true, slug: true, status: true, isPrimary: true, draftContent: true, publishedContent: true },
    }),
    getEffectivePlan(session.id),
  ]);

  if (pages.length === 0) {
    return (
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight">Create your first AURA</h1>
        <p className="mt-1 text-sm text-text-muted">
          Pick a starting point — every template is fully editable, and Remix gives you a fresh look in one tap.
        </p>
        <div className="mt-6">
          <TemplateGallery plan={plan} />
        </div>
      </div>
    );
  }

  const ids = pages.map((p) => p.id);
  const since = daysAgo(7);
  const [views, clicks] = await Promise.all([
    prisma.pageView.groupBy({ by: ["pageId"], where: { pageId: { in: ids }, createdAt: { gte: since } }, _count: { _all: true } }),
    prisma.linkClick.groupBy({ by: ["pageId"], where: { pageId: { in: ids }, createdAt: { gte: since } }, _count: { _all: true } }),
  ]);
  const viewCount = new Map(views.map((v) => [v.pageId, v._count._all]));
  const clickCount = new Map(clicks.map((c) => [c.pageId, c._count._all]));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">My pages</h1>
          <p className="mt-1 text-sm text-text-muted">Last 7 days at a glance. Tap a page to keep designing.</p>
        </div>
        <Link href="/dashboard/new" className={buttonClasses("primary", "md")}>
          <Plus className="h-4 w-4" />
          New page
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => {
          const published = page.status === "PUBLISHED";
          const path = page.isPrimary ? `/${session.username}` : `/${session.username}/${page.slug}`;
          const content = asPageContent(page.draftContent ?? page.publishedContent);
          return (
            <div key={page.id} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-surface">
              <div className="group relative">
                <PageThumb content={content} className="h-60 transition-opacity group-hover:opacity-90" />
                <span className="absolute top-3 left-3 flex gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur",
                      published ? "bg-primary/20 text-primary" : "bg-black/50 text-white/80",
                    )}
                  >
                    {published && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    {published ? "Live" : "Draft"}
                  </span>
                  {page.isPrimary && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur">
                      <Crown className="h-3 w-3" /> Main
                    </span>
                  )}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg/90 px-3 py-1.5 text-xs text-text shadow-xl backdrop-blur">
                    <Pencil className="h-3.5 w-3.5" /> Edit page
                  </span>
                </span>
                {/* Overlay link beside (not around) the live thumbnail, which has its own links. */}
                <Link href={`/builder/${page.id}`} aria-label={`Edit ${page.title}`} className="absolute inset-0" />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="truncate font-display text-base font-medium">{page.title}</p>
                <p className="truncate text-xs text-text-muted">useaura.me{path}</p>
                <div className="mt-3 flex gap-4 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {(viewCount.get(page.id) ?? 0).toLocaleString()} views
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="h-3.5 w-3.5" /> {(clickCount.get(page.id) ?? 0).toLocaleString()} clicks
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Link href={`/builder/${page.id}`} className={buttonClasses("secondary", "sm", "flex-1")}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <CopyLinkButton url={`https://useaura.me${path}`} />
                  {published && (
                    <Link href={path} target="_blank" className={buttonClasses("ghost", "sm")} aria-label="View live page">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <div className="mt-2 flex gap-1.5 border-t border-border/70 pt-2">
                  <form action={duplicatePage.bind(null, page.id)}>
                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text">
                      <Copy className="h-3 w-3" /> Duplicate
                    </button>
                  </form>
                  {!page.isPrimary && (
                    <form action={setPrimaryPage.bind(null, page.id)}>
                      <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text">
                        <Crown className="h-3 w-3" /> Make main page
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
