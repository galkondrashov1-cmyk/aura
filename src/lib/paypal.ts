// PayPal Subscriptions server helpers. The integration is fully wired but
// dormant until the env vars exist — the owner adds them in Vercel (never
// hand secrets to anyone, including AI assistants):
//   PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET  — REST app credentials
//   PAYPAL_WEBHOOK_ID                        — webhook id (for signature checks)
//   NEXT_PUBLIC_PAYPAL_CLIENT_ID             — same client id, for the JS SDK
//   NEXT_PUBLIC_PAYPAL_PLAN_PLUS_MONTHLY / _PLUS_YEARLY / _PRO_MONTHLY / _PRO_YEARLY
//   PAYPAL_ENV = "live" | "sandbox"          — defaults to sandbox
import type { Plan } from "@/lib/plans";

export const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export function paypalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET &&
      process.env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_MONTHLY &&
      process.env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_YEARLY &&
      process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY &&
      process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY,
  );
}

/** Map a PayPal plan id back to our tier. */
export function planFromPaypalPlanId(planId: string): Plan | null {
  const env = process.env;
  if (
    planId === env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_MONTHLY ||
    planId === env.NEXT_PUBLIC_PAYPAL_PLAN_PLUS_YEARLY
  )
    return "PLUS";
  if (
    planId === env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY ||
    planId === env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY
  )
    return "PRO";
  return null;
}

async function accessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`paypal token ${res.status}`);
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export type PaypalSubscription = {
  id: string;
  status: string; // ACTIVE | APPROVED | SUSPENDED | CANCELLED | EXPIRED
  plan_id: string;
  billing_info?: { next_billing_time?: string };
};

export async function getSubscription(id: string): Promise<PaypalSubscription> {
  const token = await accessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`paypal subscription ${res.status}`);
  return (await res.json()) as PaypalSubscription;
}

/** Verify a webhook came from PayPal (signature check via the REST API). */
export async function verifyWebhook(
  headers: Headers,
  rawBody: string,
): Promise<{ valid: boolean; event: { event_type: string; resource: Record<string, unknown> } | null }> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return { valid: false, event: null };
  const token = await accessToken();
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
    cache: "no-store",
  });
  if (!res.ok) return { valid: false, event: null };
  const json = (await res.json()) as { verification_status: string };
  return {
    valid: json.verification_status === "SUCCESS",
    event: JSON.parse(rawBody),
  };
}
