// Build step: sync the Prisma schema to the database — but only when one is
// configured. Production has DATABASE_URL/DIRECT_URL; preview deployments
// don't, and used to fail the whole build here. Without a database the app
// still builds (public pages render on demand), so the preview can deploy.
import { execSync } from "node:child_process";

// Local builds read .env like the Prisma CLI does; on Vercel, env vars are real.
try {
  process.loadEnvFile();
} catch {
  /* no .env file */
}

if (!process.env.DATABASE_URL) {
  console.log("[db-sync] DATABASE_URL not set — skipping prisma db push.");
  process.exit(0);
}
// The schema reads DIRECT_URL; fall back to the pooled URL if it's missing.
const env = { ...process.env, DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL };
execSync("npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit", env });
