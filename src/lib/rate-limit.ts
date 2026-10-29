import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

/** The caller's IP as Vercel reports it ("unknown" locally). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** True when `key` was hit `limit` times or more within the last `windowMs`. */
export async function limited(key: string, limit: number, windowMs: number): Promise<boolean> {
  const n = await prisma.rateLimit.count({
    where: { key, createdAt: { gte: new Date(Date.now() - windowMs) } },
  });
  return n >= limit;
}

export async function hit(key: string): Promise<void> {
  await prisma.rateLimit.create({ data: { key } });
  // Prune now and then — a day is longer than any window we use.
  if (Math.random() < 0.02) {
    await prisma.rateLimit.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 86_400_000) } } });
  }
}

export async function clear(key: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key } });
}
