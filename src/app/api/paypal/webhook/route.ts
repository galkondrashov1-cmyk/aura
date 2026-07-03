// PayPal webhook — keeps plans honest without any cron:
// cancelled/suspended/failed subscriptions keep access until the end of the
// period already paid for (next_billing_time), then expire to FREE via
// getEffectivePlan's lazy check. Renewals clear the expiry.
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhook, getSubscription } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const { valid, event } = await verifyWebhook(req.headers, raw);
  if (!valid || !event) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const type = event.event_type;
  const resource = event.resource as { id?: string; billing_agreement_id?: string };
  // Subscription events carry the sub id in resource.id; payment events in
  // billing_agreement_id.
  const subId = resource.billing_agreement_id ?? resource.id;
  if (!subId) return NextResponse.json({ ok: true });

  const ENDING = [
    "BILLING.SUBSCRIPTION.CANCELLED",
    "BILLING.SUBSCRIPTION.SUSPENDED",
    "BILLING.SUBSCRIPTION.EXPIRED",
    "BILLING.SUBSCRIPTION.PAYMENT.FAILED",
  ];
  const RENEWING = [
    "BILLING.SUBSCRIPTION.ACTIVATED",
    "BILLING.SUBSCRIPTION.RE-ACTIVATED",
    "PAYMENT.SALE.COMPLETED",
  ];

  if (ENDING.includes(type)) {
    // Paid-through date: PayPal's next_billing_time if we can read it,
    // otherwise expire immediately.
    let expires = new Date().toISOString();
    try {
      const sub = await getSubscription(subId);
      if (sub.billing_info?.next_billing_time) expires = sub.billing_info.next_billing_time;
    } catch {
      /* immediate expiry */
    }
    await prisma.$executeRaw`UPDATE "User" SET "planExpiresAt" = ${expires} WHERE "paypalSubId" = ${subId}`;
  } else if (RENEWING.includes(type)) {
    await prisma.$executeRaw`UPDATE "User" SET "planExpiresAt" = NULL WHERE "paypalSubId" = ${subId}`;
  }

  return NextResponse.json({ ok: true });
}
