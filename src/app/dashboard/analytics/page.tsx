import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const RANGES = [7, 30, 90] as const;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

const FLAGS: Record<string, string> = {};
function flag(cc: string) {
  if (!/^[A-Z]{2}$/.test(cc)) return "🌐";
  return (FLAGS[cc] ??= String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))));
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; page?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;
  const sp = await searchParams;
  const days = RANGES.find((r) => String(r) === sp.range) ?? 30;

  const pages = await prisma.page.findMany({
    where: { userId: session.id },
    select: { id: true, title: true },
    orderBy: [{ isPrimary: "desc" }, { updatedAt: "desc" }],
  });
  const selected = pages.find((p) => p.id === sp.page);
  const pageIds = selected ? [selected.id] : pages.map((p) => p.id);

  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const prevSince = new Date(since.getTime() - days * 86_400_000);

  const whereViews = { pageId: { in: pageIds }, createdAt: { gte: since } };
  const whereClicks = { pageId: { in: pageIds }, createdAt: { gte: since } };

  // Aggregated in the database — the page never loads raw event rows.
  const [daily, totalViews, totalClicks, prevViews, prevClicks, devices, referrers, countries, links] =
    pageIds.length === 0
      ? [[], 0, 0, 0, 0, [], [], [], []]
      : await Promise.all([
          prisma.$queryRaw<{ d: Date; v: number; c: number }[]>`
            SELECT day AS d,
                   COALESCE(SUM(v), 0)::int AS v,
                   COALESCE(SUM(c), 0)::int AS c
            FROM (
              SELECT date_trunc('day', "createdAt") AS day, 1 AS v, 0 AS c
                FROM "PageView" WHERE "pageId" = ANY(${pageIds}) AND "createdAt" >= ${since}
              UNION ALL
              SELECT date_trunc('day', "createdAt") AS day, 0 AS v, 1 AS c
                FROM "LinkClick" WHERE "pageId" = ANY(${pageIds}) AND "createdAt" >= ${since}
            ) t
            GROUP BY day ORDER BY day`,
          prisma.pageView.count({ where: whereViews }),
          prisma.linkClick.count({ where: whereClicks }),
          prisma.pageView.count({ where: { pageId: { in: pageIds }, createdAt: { gte: prevSince, lt: since } } }),
          prisma.linkClick.count({ where: { pageId: { in: pageIds }, createdAt: { gte: prevSince, lt: since } } }),
          prisma.pageView.groupBy({ by: ["device"], where: whereViews, _count: { _all: true } }),
          prisma.pageView.groupBy({
            by: ["referrer"],
            where: whereViews,
            _count: { _all: true },
            orderBy: { _count: { referrer: "desc" } },
            take: 8,
          }),
          prisma.pageView.groupBy({
            by: ["country"],
            where: { ...whereViews, country: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { country: "desc" } },
            take: 8,
          }),
          prisma.linkClick.groupBy({
            by: ["label", "url"],
            where: whereClicks,
            _count: { _all: true },
            orderBy: { _count: { url: "desc" } },
            take: 8,
          }),
        ]);

  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const row = daily.find((r) => dayKey(new Date(r.d)) === dayKey(d));
    return { d, v: row?.v ?? 0, c: row?.c ?? 0 };
  });
  const max = Math.max(1, ...series.map((s) => s.v));
  const hasData = totalViews > 0 || totalClicks > 0;

  const W = 640;
  const H = 180;
  const slot = W / days;
  const barW = Math.max(2, slot * 0.62);
  const href = (patch: { range?: number; page?: string | null }) => {
    const q = new URLSearchParams();
    q.set("range", String(patch.range ?? days));
    const pg = patch.page === undefined ? selected?.id : patch.page;
    if (pg) q.set("page", pg);
    return `/dashboard/analytics?${q}`;
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">Analytics</h1>
          <p className="mt-1 text-sm text-text-muted">
            {selected ? selected.title : "All pages"} · last {days} days · bots &amp; your own visits excluded
          </p>
        </div>
        <div className="flex rounded-xl border border-border bg-surface-2 p-0.5 text-sm">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={href({ range: r })}
              className={cn("rounded-[10px] px-3 py-1.5", r === days ? "bg-bg text-text shadow-sm" : "text-text-muted hover:text-text")}
            >
              {r}d
            </Link>
          ))}
        </div>
      </div>

      {pages.length > 1 && (
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          <Pill href={href({ page: null })} active={!selected}>
            All pages
          </Pill>
          {pages.map((p) => (
            <Pill key={p.id} href={href({ page: p.id })} active={selected?.id === p.id}>
              {p.title}
            </Pill>
          ))}
        </div>
      )}

      {!hasData ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <p className="text-sm text-text-muted">
            No visits in this period yet. Share your link and check back —{" "}
            <Link href="/dashboard" className="text-text underline-offset-4 hover:underline">
              go to my pages
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <Metric label="Views" value={totalViews} prev={prevViews} />
            <Metric label="Clicks" value={totalClicks} prev={prevClicks} />
            <Metric label="Click rate" value={ctr} suffix="%" />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> Clicks
              </span>
            </div>
            <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full" role="img" aria-label="Views and clicks per day">
              {series.map((s, i) => {
                const hv = (s.v / max) * H;
                const hc = (s.c / max) * H;
                const x = i * slot + (slot - barW) / 2;
                const labelEvery = days <= 7 ? 1 : days <= 30 ? 5 : 15;
                return (
                  <g key={i}>
                    <title>{`${s.d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}: ${s.v} views, ${s.c} clicks`}</title>
                    <rect x={x} y={H - hv} width={barW} height={Math.max(hv, 0)} rx={Math.min(3, barW / 2)} fill="var(--primary)" opacity={0.9} />
                    {hc > 0 && <rect x={x + barW * 0.2} y={H - hc} width={barW * 0.6} height={hc} rx={2} fill="var(--accent)" />}
                    {i % labelEvery === 0 && (
                      <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize="12" fill="var(--text-muted)">
                        {s.d.getUTCDate()}/{s.d.getUTCMonth() + 1}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Bars
              title="Top links"
              empty="No clicks yet."
              rows={links.map((l) => ({ label: l.label || l.url, n: l._count._all, sub: totalViews ? `${Math.round((l._count._all / totalViews) * 100)}% of views` : undefined }))}
            />
            <Bars
              title="Where visitors come from"
              empty="No referrers yet."
              rows={referrers.map((r) => ({ label: r.referrer ?? "Direct / apps", n: r._count._all }))}
            />
            <Bars
              title="Countries"
              empty="Country data appears on the live site."
              rows={countries.map((c) => ({ label: `${flag(c.country ?? "")} ${c.country}`, n: c._count._all }))}
            />
            <Bars
              title="Devices"
              empty="—"
              rows={devices
                .map((d) => ({ label: (d.device ?? "desktop").replace(/^./, (ch) => ch.toUpperCase()), n: d._count._all }))
                .sort((a, b) => b.n - a.n)}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "max-w-48 shrink-0 truncate rounded-full border px-3 py-1 text-xs",
        active ? "border-primary bg-primary/10 text-text" : "border-border text-text-muted hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}

function Metric({ label, value, prev, suffix = "" }: { label: string; value: number; prev?: number; suffix?: string }) {
  const delta = prev === undefined ? null : prev === 0 ? (value > 0 ? 100 : 0) : Math.round(((value - prev) / prev) * 100);
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-lg font-medium sm:text-2xl">
        {value.toLocaleString()}
        {suffix}
      </p>
      {delta !== null && (
        <p className={cn("mt-0.5 text-[11px]", delta > 0 ? "text-primary" : delta < 0 ? "text-red-400" : "text-text-muted")}>
          {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"} {Math.abs(delta)}% vs previous
        </p>
      )}
    </div>
  );
}

function Bars({ title, rows, empty }: { title: string; rows: { label: string; n: number; sub?: string }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <p className="mb-4 text-sm font-medium">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-text-muted">{empty}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex justify-between gap-3 text-sm">
                <span className="truncate text-text-muted">{r.label}</span>
                <span className="shrink-0">
                  {r.n.toLocaleString()}
                  {r.sub && <span className="ml-1.5 text-[11px] text-text-muted">{r.sub}</span>}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((r.n / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
