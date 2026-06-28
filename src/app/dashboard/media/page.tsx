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
      <h1 className="font-display text-2xl font-medium tracking-tight">Media</h1>
      <p className="mt-1 text-sm text-text-muted">
        Images you upload in the builder appear here.
      </p>

      {assets.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center text-sm text-text-muted">
          No uploads yet. Add an Image block in the builder and upload a file.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
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
