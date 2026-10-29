import Link from "next/link";
import { Download, Inbox, Mail } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { buttonClasses } from "@/components/ui/button";
import { InboxEntry } from "@/components/dashboard/inbox-entry";

export const metadata = { title: "Inbox · AURA" };

type Entry = { kind?: string; email?: string; name?: string | null; message?: string | null };

export default async function InboxPage() {
  const session = await getSession();
  if (!session) return null;
  const subs = await prisma.formSubmission.findMany({
    where: { page: { userId: session.id } },
    orderBy: { createdAt: "desc" },
    take: 300,
    select: { id: true, data: true, createdAt: true, page: { select: { title: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">Inbox</h1>
          <p className="mt-1 text-sm text-text-muted">Sign-ups and messages from the forms on your pages.</p>
        </div>
        {subs.length > 0 && (
          <a href="/api/inbox/export" download className={buttonClasses("secondary", "sm")}>
            <Download className="h-4 w-4" /> Export CSV
          </a>
        )}
      </div>

      {subs.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-primary">
            <Inbox className="h-6 w-6" />
          </span>
          <p className="font-display text-lg font-medium">No messages yet</p>
          <p className="mt-1 max-w-sm text-sm text-text-muted">
            Add a <span className="text-text">Form</span> block (newsletter or contact) to a page — every submission lands here.
          </p>
          <Link href="/dashboard" className={buttonClasses("primary", "sm", "mt-5")}>
            Go to my pages
          </Link>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {subs.map((s) => {
            const d = (s.data ?? {}) as Entry;
            return (
              <InboxEntry key={s.id} id={s.id}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-medium text-primary">
                  {(d.name || d.email || "?").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    {d.name && <span className="text-sm font-medium">{d.name}</span>}
                    <a href={`mailto:${d.email}`} className="inline-flex min-w-0 items-center gap-1 text-sm break-all text-primary hover:underline">
                      <Mail className="h-3.5 w-3.5" /> {d.email}
                    </a>
                    <span className="text-[11px] text-text-muted">
                      {d.kind === "contact" ? "Contact" : "Newsletter"} · {s.page.title} ·{" "}
                      {s.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  </div>
                  {d.message && <p className="mt-1 text-sm break-words whitespace-pre-line text-text-muted">{d.message}</p>}
                </div>
              </InboxEntry>
            );
          })}
        </div>
      )}
    </div>
  );
}
