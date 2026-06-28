# Deploying AURA (free) — Vercel + Turso + Vercel Blob + GoDaddy domain

The code already supports this. Locally nothing changes (SQLite + local uploads).
In production these env vars flip it to hosted services:

| Env var | What it does |
|---|---|
| `AUTH_SECRET` | JWT signing secret (reuse the one in `.env`, or generate a new long random string) |
| `TURSO_DATABASE_URL` | Hosted SQLite database (Turso) — e.g. `libsql://aura-xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (image uploads) |
| `DATABASE_URL` | Set to `file:./dev.db` (placeholder — only used by `prisma generate`) |

---

## 1. Push the code to GitHub
```bash
git init && git add -A && git commit -m "AURA"
# create a repo on github.com, then:
git remote add origin https://github.com/<you>/aura.git
git push -u origin main
```

## 2. Database — Turso (free)
1. Sign up at https://turso.tech (GitHub login).
2. Install CLI and create the DB:
   ```bash
   turso db create aura
   turso db show aura --url          # -> TURSO_DATABASE_URL
   turso db tokens create aura       # -> TURSO_AUTH_TOKEN
   ```
3. Load the schema into Turso (run from the project folder):
   ```bash
   npx prisma migrate diff --from-empty \
     --to-schema-datamodel prisma/schema.prisma --script > schema.sql
   turso db shell aura < schema.sql
   ```

## 3. Image storage — Vercel Blob (free)
In the Vercel dashboard → **Storage** → create a **Blob** store → copy the
`BLOB_READ_WRITE_TOKEN`. (Auto-added to the project once linked.)

## 4. Deploy on Vercel (free)
1. Sign up at https://vercel.com, **Add New → Project**, import the GitHub repo.
2. Framework auto-detects **Next.js**. Add the env vars from the table above
   (Project → Settings → Environment Variables).
3. Deploy. You get a `*.vercel.app` URL to test.

## 5. Connect useaura.me (GoDaddy)
1. Vercel → Project → **Settings → Domains** → add `useaura.me` and `www.useaura.me`.
   Vercel shows the exact records.
2. In **GoDaddy → DNS** for useaura.me set:
   - **A** record, host `@` → `76.76.21.21`
   - **CNAME** record, host `www` → `cname.vercel-dns.com`
3. Wait for DNS (minutes–an hour). Vercel auto-issues HTTPS.

## 6. First admin / seed (optional)
Sign up normally on the live site, then promote yourself to admin in Turso:
```bash
turso db shell aura "UPDATE User SET role='ADMIN' WHERE email='you@email.com';"
```

---
Notes
- Vercel Hobby is free; it's intended for personal/non-commercial use — fine to
  start, upgrade to Pro later if it becomes a paid product.
- Turso free tier and Vercel Blob free tier are plenty for launch.
