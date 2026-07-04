import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

const DAYS = 14;

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) return null;

  const pages = await prisma.page.findMany({
    where: { userId: session.id },
    select: { id: true },
  });
  const pageIds = pages.map((p) => p.id);

  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (DAYS - 1));

  const [views, clicks] = await Promise.all([
    prisma.pageView.findMany({
      where: { pageId: { in: pageIds }, createdAt: { gte: since } },
      select: { createdAt: true, device: true },
    }),
    prisma.linkClick.findMany({
      where: { pageId: { in: pageIds }, createdAt: { gte: since } },
      select: { createdAt: true, url: true, label: true },
    }),
  ]);

  const totalViews = views.length;
  const totalClicks = clicks.length;
  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    return d;
  });
  const viewsByDay: Record<string, number> = Object.fromEntries(
    days.map((d) => [dayKey(d), 0]),
  );
  for (const v of views) {
    const k = dayKey(new Date(v.createdAt));
    if (k in viewsByDay) viewsByDay[k]++;
  }
  const series = days.map((d) => viewsByDay[dayKey(d)]);
  const maxView = Math.max(1, ...series);

  const deviceCounts: Record<string, number> = {};
  for (const v of views) {
    const k = v.device ?? "desktop";
    deviceCounts[k] = (deviceCounts[k] ?? 0) + 1;
  }
  const devices = ["mobile", "desktop", "tablet"].map((d) => ({
    name: d,
    count: deviceCounts[d] ?? 0,
    pct: totalViews ? Math.round(((deviceCounts[d] ?? 0) / totalViews) * 100) : 0,
  }));

  const linkCounts: Record<string, number> = {};
  for (const c of clicks) {
    const key = c.label || c.url;
    linkCounts[key] = (linkCounts[key] ?? 0) + 1;
  }
  const topLinks = Object.entries(linkCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxLink = Math.max(1, ...topLinks.map(([, n]) => n));

  const hasData = totalViews > 0 || totalClicks > 0;

  // Chart geometry
  const W = 600;
  const H = 170;
  const slot = W / DAYS;
  const barW = slot * 0.55;

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Analytics</h1>
      <p className="mt-1 text-sm text-text-muted">Last {DAYS} days across your pages.</p>

      {!hasData ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <p className="text-sm text-text-muted">
            No visits yet. Share your page and check back —{" "}
            <Link href="/dashboard" className="text-text underline-offset-4 hover:underline">
              go to my pages
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <Metric label="Views" value={totalViews.toLocaleString()} />
            <Metric label="Clicks" value={totalClicks.toLocaleString()} />
            <Metric label="CTR" value={`${ctr}%`} />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-surface p-4 sm:p-5">
            <p className="mb-4 text-sm font-medium">Views per day</p>
            <svg viewBox={`0 0 ${W} ${H + 28}`} className="w-full" role="img" aria-label="Views per day">
              {series.map((v, i) => {
                const h = (v / maxView) * H;
                const x = i * slot + (slot - barW) / 2;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={H - h}
                      width={barW}
                      height={h}
                      rx={3}
                      fill="var(--primary)"
                    />
                    {i % 2 === 0 && (
                      <text
                        x={x + barW / 2}
                        y={H + 20}
                        textAnchor="middle"
                        fontSize="16"
                        fill="var(--text-muted)"
                      >
                        {days[i].getDate()}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <p className="mb-4 text-sm font-medium">Devices</p>
              <div className="space-y-3">
                {devices.map((d) => (
                  <div key={d.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="capitalize text-text-muted">{d.name}</span>
                      <span>{d.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <p className="mb-4 text-sm font-medium">Top links</p>
              {topLinks.length === 0 ? (
                <p className="text-sm text-text-muted">No clicks yet.</p>
              ) : (
                <div className="space-y-3">
                  {topLinks.map(([label, n]) => (
                    <div key={label}>
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <span className="truncate text-text-muted">{label}</span>
                        <span className="shrink-0">{n}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className={cn("h-full rounded-full bg-primary")}
                          style={{ width: `${Math.round((n / maxLink) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 sm:p-5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-lg font-medium sm:text-2xl">{value}</p>
    </div>
  );
}
