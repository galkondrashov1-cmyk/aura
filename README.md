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
