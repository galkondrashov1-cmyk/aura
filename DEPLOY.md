# Deploying AURA — Vercel + Vercel Postgres + Vercel Blob + GoDaddy domain

Production runs on **Vercel Postgres**. These env vars are required in production
(Project → Settings → Environment Variables):

| Env var | What it does |
|---|---|
| `AUTH_SECRET` | JWT signing secret (a long random string — generate with `openssl rand -base64 32`) |
| `DATABASE_URL` | Vercel Postgres pooled connection string (auto-added when you create the store) |
| `DIRECT_URL` | Vercel Postgres **direct** (non-pooled) connection string — used for `prisma migrate deploy` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (image uploads) |

> **Local dev now uses Postgres too** (schema provider is `postgresql`). See
> "Local development" at the bottom. The old SQLite `dev.db` is no longer the
> source of truth.

---

## 1. Push the code to GitHub
Already done — the repo lives at `github.com/galkondrashov1-cmyk/aura`. Just push
your branch and open a PR, or push to `main`.

## 2. Database — Vercel Postgres
1. Vercel dashboard → your **aura** project → **Storage** → **Create Database** →
   **Postgres**. Vercel automatically injects `DATABASE_URL`, `DIRECT_URL` (and
   `POSTGRES_*` variants) into the project's env.
2. The schema is applied by the build step. The project runs
   `prisma migrate deploy` against `DIRECT_URL` on deploy (see `package.json`
   build script / the `0_init` migration under `prisma/migrations`).
3. To apply migrations manually from your machine, pull the env and run:
   ```bash
   vercel env pull .env.production.local
   npx dotenv -e .env.production.local -- prisma migrate deploy
   ```

## 3. Image storage — Vercel Blob
In the Vercel dashboard → **Storage** → create a **Blob** store → copy the
`BLOB_READ_WRITE_TOKEN`. (Auto-added to the project once linked.)

## 4. Deploy on Vercel
1. The GitHub repo is already importable in Vercel (project `aura` is linked).
2. Framework auto-detects **Next.js**. Confirm the env vars above are set.
3. Deploy. You get a `*.vercel.app` URL to test.

## 5. Connect useaura.me (GoDaddy)
1. Vercel → Project → **Settings → Domains** → add `useaura.me` and `www.useaura.me`.
   Vercel shows the exact records.
2. In **GoDaddy → DNS** for useaura.me set:
   - **A** record, host `@` → `76.76.21.21`
   - **CNAME** record, host `www` → `cname.vercel-dns.com`
3. Wait for DNS (minutes–an hour). Vercel auto-issues HTTPS.

## 6. First admin / seed (optional)
Sign up normally on the live site, then promote yourself to admin:
```bash
vercel env pull .env.production.local
npx dotenv -e .env.production.local -- prisma db execute \
  --stdin <<< "UPDATE \"User\" SET role='ADMIN' WHERE email='you@email.com';"
```

---

## Local development
Local dev now needs a Postgres database (matching production):
1. Create a free Postgres — a **Vercel Postgres dev branch**, **Neon**, or a local
   Docker one: `docker run -e POSTGRES_PASSWORD=aura -p 5432:5432 -d postgres`.
2. In `.env` set both:
   ```
   DATABASE_URL="postgresql://postgres:aura@localhost:5432/aura"
   DIRECT_URL="postgresql://postgres:aura@localhost:5432/aura"
   AUTH_SECRET="<any long random string>"
   ```
3. Apply the schema and generate the client:
   ```bash
   npx prisma migrate dev
   ```

---
Notes
- Vercel Hobby is free; intended for personal/non-commercial use — upgrade to Pro
  if it becomes a paid product.
- Vercel Postgres and Vercel Blob free tiers are plenty for launch.
