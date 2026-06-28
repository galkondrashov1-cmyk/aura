# Implementation roadmap

| Phase | Focus | "Done" looks like |
|---|---|---|
| **0 — Foundation** | Repo, Next + TS + Tailwind v4, dual Deep Space modes as tokens, base components, marketing hero, auth stubs, dashboard shell. (Prisma + Auth.js wired next.) | Click through home → login/signup → dashboard |
| **1 — Renderer + schema** | Block JSON schema, `PublicPageRenderer`, first ~6 blocks, `/[username]` SSR | A page renders publicly and fast |
| **2 — Simple builder** | Template gallery, pick→customize→publish, draft/publish, autosave | A user ships a real page from a template |
| **3 — Advanced builder** | Drag-drop canvas, block library, style inspector, Theme Engine | Build a custom page block-by-block |
| **4 — Media & content** | S3 uploads, gallery/video/files/presentations, dynamic link cards, GIF generator | All content types work |
| **5 — Analytics** | Event capture, aggregates, dashboard charts, PostHog | Real view/click insights |
| **6 — AI builder** | Prompt → block JSON via Claude | "I'm a fitness coach…" produces a designed page |
| **7 — Admin** | Users, moderation, platform stats | Full admin control |
| **8 — Polish & launch** | Animations, SEO, a11y, performance, mobile, examples page | Production-ready |

## Phase 0 — status

Done in this pass:

- [x] Next.js 16 + TypeScript + Tailwind v4 scaffold
- [x] Dual-mode Deep Space tokens (Vivid + Muted) in `globals.css`
- [x] Fonts: Plus Jakarta Sans (display) + Inter (body)
- [x] Base components: `AuraLogo`/`AuraMark`, `Button`, `Input`, `cn()`
- [x] Marketing homepage (hero + live page mock), Vivid mode
- [x] Auth stub pages: `/login`, `/signup` (visual only; click through to dashboard)
- [x] Dashboard shell with sidebar + empty state, Muted mode
- [x] Planning docs (`/docs`)

Phase 0.x — done in this pass:

- [x] Prisma + SQLite (local dev), `User` + `Page` models, migration applied
- [x] Email/password auth: `signupAction` / `loginAction` / `logoutAction`
      (bcrypt hashing, zod validation, username claim), JWT session cookie via `jose`
- [x] `getSession` / `createSession` / `destroySession` helpers (Auth.js-shaped interface)
- [x] `proxy.ts` optimistic guard + server-side layout guard on `/dashboard`
- [x] Verified end-to-end: signup → dashboard → logout → login

Phase 1 — done (block renderer + live pages):

- [x] Block JSON schema (`src/lib/blocks.ts`): hero, links, text, socials, image, video, divider, faq
- [x] `PublicPageRenderer` + per-block components (reused by the builder preview)
- [x] Public pages at `/[username]` (SSR, `generateMetadata` for SEO), branded `not-found`
- [x] Seeded demo page; verified `/maya` renders and unknown users 404

Phase 2 — done (simple builder + templates + publish):

- [x] Template library (`src/lib/templates.ts`): Creator, Coach, Freelancer, Minimal
- [x] Page server actions: `createPage`, `savePage`, `publishPage`, `deletePage`
- [x] Builder at `/builder/[pageId]` — edit profile/links/about/theme with **live preview**
- [x] Per-page Vivid↔Muted theme switch in the builder
- [x] Dashboard lists real pages (Published/Draft) with Edit + View; templates gallery
- [x] Verified end-to-end: create from template → edit → publish → live `/maya` + SEO update

Phase 3 — done (core advanced builder):

- [x] Generic block-based editor (`editor.tsx`) — all 8 block types editable inline
- [x] Add any block type, delete, reorder (up/down buttons + native drag handle)
- [x] Nested item editors for links / socials / FAQ; per-page theme switch
- [x] Verified: add block, reorder, live preview update
- [x] Block types: added Gallery (multi-image), Product cards, and Contact form
      (with `FormSubmission` storage via `POST /api/submit`)
- [x] Page design control: per-page accent color (overrides `--primary` in the renderer)
- [x] Delete-page button in the builder (confirm-gated)
- [ ] Remaining for full "advanced": deeper per-block style inspector (per-block spacing/typography),
      polished drag-drop animation

Account & settings:

- [x] `/dashboard/settings` — update name/username (unique + reserved checks, session re-issued)
      and change password (`src/lib/actions/account.ts`)

Polish (this pass):

- [x] Full marketing homepage: hero + features + templates showcase + how-it-works
      + testimonials + CTA + footer (`src/components/marketing.tsx`)
- [x] `/examples` page: live published pages + template gallery
- [x] Shared `SiteNav` + `Footer`; "See examples" / nav wired up

Phase 5 — done (analytics; built before Phase 4 since it needs no external services):

- [x] `PageView` + `LinkClick` models (migration `analytics`)
- [x] View beacon (`view-beacon.tsx` → `POST /api/track-view`) on public pages
- [x] Click redirect tracker (`GET /api/r` records `LinkClick`, then 302s to target)
- [x] Renderer routes link/social hrefs through the tracker when `trackPageId` is set
- [x] Analytics dashboard (`/dashboard/analytics`): Views / Clicks / CTR tiles, 14-day
      bar chart (hand-rolled SVG, no chart lib), device split, top links
- [x] Seeded 14 days of demo data; verified counts increment live from real events

Phase 7 — done (admin dashboard):

- [x] Role-gated `/admin` (server-side role check in layout + `/admin` in proxy matcher)
- [x] Admin actions (`src/lib/actions/admin.ts`): `suspendUser` / `activateUser` / `deleteUser`
- [x] Overview (platform stats), Users (search + suspend/activate/delete), Pages list
- [x] Admin seed account; "Admin" link surfaces in the dashboard for admins
- [x] Verified: non-admin blocked; suspend 404s the public page; activate restores it

Phase 4 — done (media uploads, local dev shim):

- [x] `MediaAsset` model (migration `media`)
- [x] `POST /api/upload` (auth, 5MB image cap) → writes to `UPLOAD_DIR`, records asset
- [x] `GET /api/media/[name]` serves files (route handler, not static — works in dev regardless of cwd)
- [x] Builder Image block has an Upload button; `/dashboard/media` gallery
- [x] Verified: upload → serve (200, correct content-type) → appears in library
- [ ] Swap local-fs shim → S3 for production

Phase 6 — done (AI builder, verified to the API boundary):

- [x] `src/lib/ai.ts` `generatePageContent()` — Claude (`claude-opus-4-8`) via `@anthropic-ai/sdk`,
      strong schema-constrained system prompt, defensive JSON extraction → `asPageContent`
- [x] `aiGenerateAction` server action (creates a draft, redirects to the builder)
- [x] `/dashboard/ai` page + `AiForm` (describe yourself → generate)
- [x] Verified: submits, runs the action, degrades gracefully when `ANTHROPIC_API_KEY` is unset
- [ ] Set `ANTHROPIC_API_KEY` in `.env` to enable real generation (only blocked item)

Still pending:

- [ ] Switch SQLite → PostgreSQL for production (one-line provider change + connection string)
- [ ] Swap custom auth → Auth.js once it supports Next 16; add Google OAuth (needs client id/secret)
- [ ] Real shadcn/ui install + a `ThemeToggle` (Vivid ↔ Muted)
- [ ] Protect `/admin` once it exists
- [ ] Deploy to Vercel (needs your Vercel account)

### Notes / decisions

- **SQLite for local dev** instead of Postgres: zero-setup, no native build, instant demo.
  Prisma makes the production switch trivial. Enum fields are stored as `String` for
  SQLite portability (validated in the app layer).
- **Custom auth instead of Auth.js (for now):** Auth.js v5 (beta) does not yet declare
  Next.js 16 support. The auth layer mirrors the Auth.js interface so the swap is small.
- **Prisma pinned to v6:** Prisma 7 requires `prisma.config.ts` + driver adapters (and a
  native SQLite adapter on Windows); v6's built-in engine is more reliable here.
