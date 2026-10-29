// Transactional email through Resend's HTTP API — dormant until the owner sets
// RESEND_API_KEY and EMAIL_FROM (e.g. "AURA <hello@useaura.me>") in Vercel.
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(msg: { to: string; subject: string; text: string; html: string }): Promise<boolean> {
  if (!emailConfigured()) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, ...msg }),
    cache: "no-store",
  }).catch(() => null);
  return Boolean(res?.ok);
}
