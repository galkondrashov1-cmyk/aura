import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { Plus, ExternalLink, Pencil, Eye, MousePointerClick, Copy, Crown } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { asPageContent } from "@/lib/blocks";
import { effectivePlanFrom } from "@/lib/plan-source";
import { duplicatePage, setPrimaryPage } from "@/lib/actions/pages";
import { CopyLinkButton } from "@/components/copy-link-button";
import { PageThumb } from "@/components/dashboard/page-thumb";
import { TemplateGallery } from "@/components/dashboard/template-gallery";
import { livePages } from "@/lib/public-page";
import { fitToPlanReport } from "@/lib/studio";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
// Live miniatures are full page renders; past this many, cards get a light placeholder.
const LIVE_THUMBS = 12;

export default async function DashboardHome() {
  const session = await getSession();
  if (!session) return null;
  const plan = effectivePlanFrom(session);
  const since = daysAgo(7);
  // One parallel round trip: the stats filter by owner, not by page ids.
  const [pages, views, clicks, live] = await Promise.all([
    prisma.page.findMany({
      where: { userId: session.id },
      orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
      select: { id: true, title: true, slug: true, status: true, isPrimary: true, draftContent: true, publishedContent: true },
    }),
    prisma.pageView.groupBy({ by: ["pageId"], where: { page: { userId: session.id }, createdAt: { gte: since } }, _count: { _all: true } }),
    prisma.linkClick.groupBy({ by: ["pageId"], where: { page: { userId: session.id }, createdAt: { gte: since } }, _count: { _all: true } }),
    livePages(session.id, plan),
  ]);

  if (pages.length === 0) {
    return (
      <div>
        <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">צרו את העמוד הראשון שלכם</h1>
        <p className="mt-1 text-sm text-text-muted">
          בחרו נקודת התחלה — כל תבנית ניתנת לעריכה מלאה, ו־Remix נותן מראה חדש בלחיצה.
        </p>
        <div className="mt-6">
          <TemplateGallery plan={plan} />
        </div>
      </div>
    );
  }

  const online = new Set(live.map((p) => p.id));
  const viewCount = new Map(views.map((v) => [v.pageId, v._count._all]));
  const clickCount = new Map(clicks.map((c) => [c.pageId, c._count._all]));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">העמודים שלי</h1>
          <p className="mt-1 text-sm text-text-muted">7 הימים האחרונים במבט אחד. לחצו על עמוד כדי להמשיך לעצב.</p>
        </div>
        <Link href="/dashboard/new" className={buttonClasses("primary", "md")}>
          <Plus className="h-4 w-4" />
          עמוד חדש
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page, index) => {
          const published = page.status === "PUBLISHED";
          const offline = published && !online.has(page.id);
          // Premium touches the live page skips on the current plan.
          const skipped = published && !offline ? fitToPlanReport(asPageContent(page.publishedContent), plan).locked.length : 0;
          const path = page.isPrimary ? `/${session.username}` : `/${session.username}/${page.slug}`;
          const content = asPageContent(page.draftContent ?? page.publishedContent);
          return (
            <div
              key={page.id}
              // Off-screen cards skip rendering entirely — dashboards with dozens of pages stay fast.
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface [contain-intrinsic-size:auto_440px] [content-visibility:auto]"
            >
              <div className="group relative">
                {index < LIVE_THUMBS ? (
                  <PageThumb content={content} className="h-60 transition-opacity group-hover:opacity-90" />
                ) : (
                  <div
                    aria-hidden
                    className="grid h-60 place-items-center font-display text-5xl text-white/80"
                    style={{ background: `linear-gradient(140deg, ${content.design?.accent ?? "#00e5a0"}55, #08090c 70%)` }}
                  >
                    {page.title.slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="absolute top-3 start-3 flex gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur",
                      published && !offline ? "bg-primary/20 text-primary-text" : "bg-black/50 text-white/80",
                    )}
                  >
                    {published && !offline && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    {offline ? "לא באוויר · מגבלת חבילה" : published ? "באוויר" : "טיוטה"}
                  </span>
                  {page.isPrimary && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur">
                      <Crown className="h-3 w-3" /> ראשי
                    </span>
                  )}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg/90 px-3 py-1.5 text-xs text-text shadow-xl backdrop-blur">
                    <Pencil className="h-3.5 w-3.5" /> Edit page
                  </span>
                </span>
                {/* Overlay link beside (not around) the live thumbnail, which has its own links. */}
                <Link href={`/builder/${page.id}`} aria-label={`עריכת ${page.title}`} className="absolute inset-0" />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="truncate font-display text-base font-medium">{page.title}</p>
                <p className="truncate text-xs text-text-muted">{BRAND.domain}{path}</p>
                <div className="mt-3 flex gap-4 text-xs text-text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {(viewCount.get(page.id) ?? 0).toLocaleString()} צפיות
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MousePointerClick className="h-3.5 w-3.5" /> {(clickCount.get(page.id) ?? 0).toLocaleString()} קליקים
                  </span>
                </div>

                {(offline || skipped > 0) && (
                  <Link href="/dashboard/upgrade" className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary-text hover:bg-primary/15">
                    {offline
                      ? "העמוד מעבר למגבלת העמודים של החבילה, ולכן הוא לא באוויר. שדרגו כדי להחזיר אותו ←"
                      : `${skipped === 1 ? "נגיעת פרימיום אחת מוסתרת" : `${skipped} נגיעות פרימיום מוסתרות`} בעמוד החי. שדרגו כדי להציג ←`}
                  </Link>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <Link href={`/builder/${page.id}`} className={buttonClasses("secondary", "sm", "flex-1")}>
                    <Pencil className="h-4 w-4" />
                    עריכה
                  </Link>
                  <CopyLinkButton url={`https://${BRAND.domain}${path}`} />
                  {published && !offline && (
                    <Link href={path} target="_blank" className={buttonClasses("ghost", "sm")} aria-label="צפייה בעמוד החי">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <div className="mt-2 flex gap-1.5 border-t border-border/70 pt-2">
                  <form action={duplicatePage.bind(null, page.id)}>
                    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text">
                      <Copy className="h-3 w-3" /> שכפול
                    </button>
                  </form>
                  {!page.isPrimary && (
                    <form action={setPrimaryPage.bind(null, page.id)}>
                      <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-text-muted hover:bg-surface-2 hover:text-text">
                        <Crown className="h-3 w-3" /> הגדרה כעמוד ראשי
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
