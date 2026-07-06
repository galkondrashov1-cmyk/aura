"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function setAppointmentStatus(id: string, status: "CONFIRMED" | "CANCELLED") {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.appointment.updateMany({
    where: { id, businessId: session.id },
    data: { status },
  });
  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard");
}
