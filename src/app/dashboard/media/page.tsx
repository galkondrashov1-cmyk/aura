import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function MediaPage() {
  const session = await getSession();
  const assets = session
    ? await prisma.mediaAsset.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        take: 60,
      })
    : [];

  return (
    <div>
      <h1 className="font-display text-[2rem] leading-tight font-black tracking-tight">מדיה</h1>
      <p className="mt-1 text-sm text-text-muted">
        תמונות שהעליתם בעורך מופיעות כאן.
      </p>

      {assets.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center text-sm text-text-muted">
          עוד אין העלאות. הוסיפו בלוק תמונה בעורך והעלו קובץ.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className="aspect-square bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="truncate px-3 py-2 text-xs text-text-muted">
                {Math.max(1, Math.round(a.sizeBytes / 1024))} KB
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
