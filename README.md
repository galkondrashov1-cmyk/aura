# AURA — useaura.me

A design studio for personal landing pages. Creators, freelancers and small
businesses pick a template, make it theirs, and publish to
`useaura.me/<username>` (plus extra pages at `useaura.me/<username>/<slug>`).

Stack: Next.js 16 (App Router, Turbopack) · React 19 · Tailwind v4 · Prisma 6 +
Postgres · Vercel Blob · PayPal subscriptions (dormant until configured).
Deployment notes live in [DEPLOY.md](./DEPLOY.md); planning docs in [docs/](./docs).

## How it fits together

- **A page is JSON** — `{ blocks, design }` (`src/lib/blocks.ts`), stored as a
  draft and a published snapshot on `Page`. `asPageContent()` is the single
  sanitizer for anything coming from the DB or the client.
- **One renderer** — `src/components/renderer/page-renderer.tsx` renders the
  public page, the editor canvas, draft previews, dashboard thumbnails and the
  homepage showcase. Blocks live in `renderer/blocks.tsx`; interactive bits are
  small client islands (gallery, countdown, typewriter, count-up, forms, video).
- **Design studio** — classic presets in `src/lib/design.ts` (backgrounds,
  button styles, effects, themes); 2.0 dimensions in `src/lib/studio.ts`
  (layouts, title effects, typography, custom/photo backgrounds, live
  backgrounds, reveals, sections, cursors, Remix, plan fitting). Styles are in
  `src/app/studio.css`, keyed off CSS variables on the page wrapper.
- **Plans** — `src/lib/plans.ts` (caps) + tiers on each studio choice and block
  (`BLOCK_TIER`). The editor gates; `fitToPlan()` adapts templates on creation.
- **Templates** — `src/lib/templates.ts`.

## Performance model

- Public pages are ISR (`revalidate = 3600`, `generateStaticParams → []`):
  rendered once, then served from cache. Anything that changes what visitors see
  calls `revalidateUser()` (publish, delete, rename, plan change, suspension).
- Live canvas/WebGL backgrounds and custom cursors are separate chunks loaded
  only by pages that use them; they pause off-screen and respect reduced motion.
- Scroll reveals are pure CSS (`animation-timeline: view()`), zero JS.
- Images are downscaled and re-encoded to WebP in the browser before upload.
- YouTube/Vimeo load a poster first; the player only downloads on tap.

## Tracking

- Views: one beacon per visitor per 30 min; bots and the page owner are
  skipped; the real `document.referrer` and Vercel's country header are stored.
- Clicks: outbound links go through `/api/r`, HMAC-signed at render time
  (`src/lib/links-server.ts`) so it can't be used as an open redirect.
- Forms post to `/api/forms` and land in the owner's Inbox (CSV export).

## Plans & pricing

- One source of truth: `src/lib/pricing.json` (₪) feeds the pricing page, the
  upgrade page, the in-editor upsell and `scripts/paypal-setup.mjs`.
- What each plan includes lives in `caps()` (`src/lib/plans.ts`); the
  comparison table (`src/lib/plan-matrix.ts`) is computed from the real
  feature lists, so it can't drift from the product.
- Try before you buy: every effect works in the editor; `fitToPlanReport()`
  (`src/lib/studio.ts`) lists what the live page will skip, and public pages,
  forms and the page limit are enforced on the server.
- Early access: paid plans are claimable for free until PayPal is configured.
  The admin overview can then start a countdown that ends early access.

## Environment

Required: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`. Optional:

| Variable | Enables |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Uploads on Vercel Blob (local disk otherwise) |
| `PAYPAL_*`, `NEXT_PUBLIC_PAYPAL_*` | Paid subscriptions (see `src/lib/paypal.ts`) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Password-reset emails (admins can hand out reset links without it) |
| `SUPPORT_EMAIL` | Shown on "Forgot password" while emails are off |
| `ADMIN_PANEL_CODE` | Second factor for /admin — **set it**; the fallback is public |
| `ADMIN_BOOTSTRAP_EMAIL` | Promotes that account to admin on login |
| `SITE_URL` | Canonical origin (defaults to https://useaura.me) |

## Development

```bash
cp .env.example .env   # point DATABASE_URL / DIRECT_URL at a local Postgres
npm install
npx prisma db push
npm run dev
```

Checks: `npm run typecheck` · `npm run lint` · `npm run build`.

`npm run build` runs `scripts/db-sync.mjs` first: it syncs the Prisma schema
when `DATABASE_URL` is set and skips otherwise, so preview deployments without
a database still build.
