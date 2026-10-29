// Server-only helpers for removing an account. NOT a "use server" module: these
// take a user id and must never be callable from the browser.
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { cancelSubscription, paypalConfigured } from "@/lib/paypal";

/** Cancel an active PayPal subscription (best effort) before an account goes away. */
export async function stopBilling(userId: string) {
  const rows = await prisma.$queryRaw<{ paypalSubId: string | null; planExpiresAt: string | null }[]>`
    SELECT "paypalSubId", "planExpiresAt" FROM "User" WHERE id = ${userId} LIMIT 1
  `;
  const sub = rows[0];
  if (sub?.paypalSubId && !sub.planExpiresAt && paypalConfigured()) {
    await cancelSubscription(sub.paypalSubId, "AURA account deleted").catch(() => {});
  }
}

/** Delete the user's uploaded files from Blob storage (rows cascade with the user). */
export async function purgeMedia(userId: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const media = await prisma.mediaAsset.findMany({ where: { userId }, select: { url: true } });
  const urls = media.map((m) => m.url).filter((u) => u.startsWith("https://"));
  if (urls.length) await del(urls).catch(() => {});
}

/** Everything that must happen before the User row is deleted. */
export async function beforeAccountDelete(userId: string) {
  await Promise.all([stopBilling(userId), purgeMedia(userId)]);
}
