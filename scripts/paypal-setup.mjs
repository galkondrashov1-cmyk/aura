// One-time PayPal billing setup. Run it YOURSELF with your credentials —
// never share PAYPAL_CLIENT_SECRET with anyone (including AI assistants).
//
//   PAYPAL_ENV=live PAYPAL_CLIENT_ID=xxx PAYPAL_CLIENT_SECRET=yyy node scripts/paypal-setup.mjs
//
// Creates the AURA product + 4 subscription plans and prints the env vars to
// paste into Vercel. Yearly is the headline price; monthly is +20%.
const BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
const id = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET (and PAYPAL_ENV=live for production).");
  process.exit(1);
}

const token = await (async () => {
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`token ${res.status}: ${await res.text()}`);
  return (await res.json()).access_token;
})();

async function api(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

const product = await api("/v1/catalogs/products", {
  name: "AURA subscription",
  description: "AURA — premium personal pages (useaura.me)",
  type: "SERVICE",
  category: "SOFTWARE",
});
console.log("product:", product.id);

async function plan(name, value, interval_unit) {
  const p = await api("/v1/billing/plans", {
    product_id: product.id,
    name,
    status: "ACTIVE",
    billing_cycles: [
      {
        frequency: { interval_unit, interval_count: 1 },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0, // renew until cancelled
        pricing_scheme: { fixed_price: { value, currency_code: "USD" } },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      payment_failure_threshold: 2, // suspend after 2 failed payments → webhook expires the plan
    },
  });
  console.log(`${name}: ${p.id}`);
  return p.id;
}

// Yearly = headline (4.99 / 7.99 per month, billed yearly). Monthly = +20%.
const plusMonthly = await plan("AURA Plus (monthly)", "5.99", "MONTH");
const plusYearly = await plan("AURA Plus (yearly)", "59.88", "YEAR");
const proMonthly = await plan("AURA Pro (monthly)", "9.59", "MONTH");
const proYearly = await plan("AURA Pro (yearly)", "95.88", "YEAR");

console.log("\nAdd these to Vercel → Settings → Environment Variables:\n");
console.log(`NEXT_PUBLIC_PAYPAL_PLAN_PLUS_MONTHLY=${plusMonthly}`);
console.log(`NEXT_PUBLIC_PAYPAL_PLAN_PLUS_YEARLY=${plusYearly}`);
console.log(`NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=${proMonthly}`);
console.log(`NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=${proYearly}`);
