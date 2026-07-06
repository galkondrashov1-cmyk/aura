"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const serviceSchema = z.object({
  name: z.string().min(1, "שם שירות חסר").max(80),
  description: z.string().max(200).optional(),
  durationMin: z.coerce.number().int().min(5, "משך מינימלי 5 דקות").max(600),
  price: z.union([z.coerce.number().int().min(0).max(100000), z.literal("").transform(() => null), z.null()]),
});

export type ServiceState = { error?: string } | null;

export async function upsertService(_prev: ServiceState, formData: FormData): Promise<ServiceState> {
  const session = await getSession();
  if (!session) return { error: "לא מחוברים" };

  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    description: String(formData.get("description") ?? "") || undefined,
    durationMin: formData.get("durationMin"),
    price: String(formData.get("price") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "פרטים לא תקינים" };

  const id = String(formData.get("id") ?? "");
  const data = {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    durationMin: parsed.data.durationMin,
    price: parsed.data.price,
  };

  if (id) {
    const owned = await prisma.service.findFirst({ where: { id, businessId: session.id } });
    if (!owned) return { error: "השירות לא נמצא" };
    await prisma.service.update({ where: { id }, data });
  } else {
    const count = await prisma.service.count({ where: { businessId: session.id } });
    await prisma.service.create({ data: { ...data, businessId: session.id, order: count } });
  }
  revalidatePath("/dashboard/services");
  revalidatePath(`/${session.slug}`);
  return null;
}

export async function deleteService(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.service.deleteMany({ where: { id, businessId: session.id } });
  revalidatePath("/dashboard/services");
  revalidatePath(`/${session.slug}`);
}

export async function toggleService(id: string, active: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  await prisma.service.updateMany({ where: { id, businessId: session.id }, data: { active } });
  revalidatePath("/dashboard/services");
  revalidatePath(`/${session.slug}`);
}

export async function moveService(id: string, dir: -1 | 1) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const all = await prisma.service.findMany({
    where: { businessId: session.id },
    orderBy: { order: "asc" },
  });
  const idx = all.findIndex((s) => s.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= all.length) return;
  await prisma.$transaction([
    prisma.service.update({ where: { id: all[idx].id }, data: { order: swap } }),
    prisma.service.update({ where: { id: all[swap].id }, data: { order: idx } }),
  ]);
  revalidatePath("/dashboard/services");
  revalidatePath(`/${session.slug}`);
}
