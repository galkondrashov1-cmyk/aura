"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { timeToMin } from "@/lib/utils";

export type HoursState = { error?: string; saved?: boolean } | null;

/** Save the full weekly schedule in one go (7 rows of enabled/start/end). */
export async function saveHours(_prev: HoursState, formData: FormData): Promise<HoursState> {
  const session = await getSession();
  if (!session) return { error: "לא מחוברים" };

  const rows: { day: number; startMin: number; endMin: number }[] = [];
  for (let day = 0; day < 7; day++) {
    if (formData.get(`enabled-${day}`) !== "on") continue;
    const start = timeToMin(String(formData.get(`start-${day}`) ?? "09:00"));
    const end = timeToMin(String(formData.get(`end-${day}`) ?? "17:00"));
    if (end <= start) return { error: "שעת סיום חייבת להיות אחרי שעת התחלה" };
    rows.push({ day, startMin: start, endMin: end });
  }

  await prisma.$transaction([
    prisma.workingHour.deleteMany({ where: { businessId: session.id } }),
    prisma.workingHour.createMany({
      data: rows.map((r) => ({ ...r, businessId: session.id })),
    }),
  ]);
  revalidatePath("/dashboard/hours");
  revalidatePath(`/${session.slug}`);
  return { saved: true };
}
