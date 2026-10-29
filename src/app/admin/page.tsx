import { prisma } from "@/lib/prisma";
import { paypalConfigured } from "@/lib/paypal";
import { endEarlyAccess } from "@/lib/actions/admin";

export default async function AdminOverview() {
  const [users, pages, published, views, clicks, recent, early] = await Promise.all([
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
    prisma.$queryRaw<{ plan: string; ending: boolean; n: bigint }[]>`
      SELECT plan, ("planExpiresAt" IS NOT NULL) AS ending, COUNT(*) AS n FROM "User"
      WHERE plan <> 'FREE' AND "paypalSubId" IS NULL GROUP BY plan, ending
    `,
  ]);
  const count = (pred: (r: (typeof early)[number]) => boolean) =>
    early.filter(pred).reduce((n, r) => n + Number(r.n), 0);
  const open = count((r) => !r.ending);
  const ending = count((r) => r.ending);
  const payments = paypalConfigured();

  return (
    <div>
      <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">סקירה</h1>
      <p className="mt-1 text-sm text-text-muted">מצב הפלטפורמה במבט אחד.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Metric label="משתמשים" value={users} />
        <Metric label="עמודים" value={pages} />
        <Metric label="פורסמו" value={published} />
        <Metric label="סך צפיות" value={views} />
        <Metric label="סך קליקים" value={clicks} />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <p className="text-sm font-medium">גישה מוקדמת</p>
        <p className="mt-1 text-sm text-text-muted">
          {open} משתמשים ב־Plus/Pro בחינם ({count((r) => !r.ending && r.plan === "PLUS")} Plus ·{" "}
          {count((r) => !r.ending && r.plan === "PRO")} Pro){ending > 0 ? ` · ${ending} כבר בספירה לאחור` : ""}.
        </p>
        {payments ? (
          <form action={endEarlyAccess} className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-text-muted">לסיים בעוד</span>
            <input
              name="days"
              type="number"
              min={1}
              max={90}
              defaultValue={14}
              className="h-9 w-20 rounded-xl border border-border bg-surface-2 px-3"
            />
            <span className="text-text-muted">ימים</span>
            <button
              type="submit"
              disabled={open === 0}
              className="h-9 rounded-full bg-primary px-4 font-medium text-primary-ink disabled:opacity-40"
            >
              התחלת ספירה לאחור
            </button>
            <span className="basis-full text-xs text-text-muted">
              כל משתמש יראה את תאריך הסיום בלוח הבקרה ויוכל להירשם למנוי כדי להישאר בחבילה. אחר כך הם עוברים
              לחינם — שום דבר לא נמחק. חבילות שהענקתם ידנית כלולות; הענקו אותן מחדש ממסך המשתמשים.
            </span>
          </form>
        ) : (
          <p className="mt-3 text-xs text-text-muted">
            תשלומים עוד לא הוגדרו, ולכן אי אפשר לסיים את הגישה המוקדמת (אנשים פשוט יבקשו את החבילה שוב).
            הוסיפו קודם את משתני PayPal — ראו scripts/paypal-setup.mjs.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <p className="mb-4 text-sm font-medium">משתמשים חדשים</p>
        <div className="space-y-2">
          {recent.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 px-4 py-2.5 text-sm"
            >
              <div className="min-w-0">
                <span className="truncate">@{u.username}</span>
                <span className="ms-2 text-text-muted">{u.email}</span>
              </div>
              <span className="shrink-0 text-xs text-text-muted">
                {new Date(u.createdAt).toLocaleDateString("he-IL")}
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
    <div className="rounded-lg bg-surface p-4">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl font-medium">{value.toLocaleString()}</p>
    </div>
  );
}
