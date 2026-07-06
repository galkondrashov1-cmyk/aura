import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatHeDate, formatHeTime, nowMs } from "@/lib/utils";
import { HilaLogo, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "ביטול תור" };

type Props = { params: Promise<{ token: string }> };

export default async function CancelPage({ params }: Props) {
  const { token } = await params;
  const appt = await prisma.appointment.findUnique({
    where: { cancelToken: token },
    include: { business: { select: { name: true, slug: true } }, service: true },
  });
  if (!appt) notFound();

  const past = appt.startsAt.getTime() < nowMs();
  const cancelled = appt.status === "CANCELLED";

  async function cancelAction() {
    "use server";
    await prisma.appointment.updateMany({
      where: { cancelToken: token, status: { not: "CANCELLED" } },
      data: { status: "CANCELLED" },
    });
    revalidatePath(`/cancel/${token}`);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <HilaLogo size={30} />
      </div>
      <div className="card w-full max-w-md p-7 text-center">
        <h1 className="text-xl font-extrabold">התור שלך אצל {appt.business.name}</h1>
        <p className="mt-3 text-ink-2">
          {appt.service?.name && <>{appt.service.name} · </>}
          {formatHeDate(appt.startsAt)} · {formatHeTime(appt.startsAt)}
        </p>
        <div className="mt-4">
          {cancelled ? (
            <Badge tone="red">התור בוטל</Badge>
          ) : appt.status === "PENDING" ? (
            <Badge tone="gold">ממתין לאישור העסק</Badge>
          ) : (
            <Badge tone="green">מאושר</Badge>
          )}
        </div>
        {!cancelled && !past && (
          <form action={cancelAction} className="mt-6">
            <button className="w-full rounded-xl bg-red-500/15 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500/25 cursor-pointer">
              ביטול התור
            </button>
          </form>
        )}
        {past && !cancelled && <p className="mt-4 text-sm text-ink-2">התור כבר עבר.</p>}
        <Link href={`/${appt.business.slug}`} className="mt-5 inline-block text-sm text-halo hover:underline">
          לעמוד של {appt.business.name}
        </Link>
      </div>
    </div>
  );
}
