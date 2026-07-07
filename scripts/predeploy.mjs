// Runs before `next build` on every deploy. With a DATABASE_URL it applies
// the schema and seeds the demo business; without one it lets the build
// proceed (marketing pages work; DB-backed pages need the env var).
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL is not set — skipping `prisma db push` + demo seed.\n" +
      "    The site will build, but signup/booking pages need a database.\n" +
      "    Vercel: Storage → Create Database (Postgres/Neon), then redeploy.",
  );
  process.exit(0);
}

execSync("npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit" });
execSync("node scripts/seed-demo.mjs", { stdio: "inherit" });
