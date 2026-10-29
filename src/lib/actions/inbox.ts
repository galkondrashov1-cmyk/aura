"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

/** Remove one inbox entry (spam, test sign-ups). Owner only. */
export async function deleteSubmission(id: string): Promise<{ ok: boolean }> {
  const user = await getSession();
  if (!user) return { ok: false };
  const { count } = await prisma.formSubmission.deleteMany({ where: { id, page: { userId: user.id } } });
  return { ok: count > 0 };
}
