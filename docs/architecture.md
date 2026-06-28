# Architecture

## System overview

A single **Next.js (App Router)** app on Vercel, organized in layers:

- **Marketing** — `/`, `/examples` (static, SEO-first).
- **Auth** — Auth.js: email+password, Google OAuth, unique-username claim at signup.
- **Dashboard** — authenticated app shell (pages, analytics, templates, media, settings).
- **Builder** — the editor (Simple / Advanced / AI), all writing one schema.
- **Renderer** — public pages at `/[username]`, server-rendered with ISR +
  on-publish revalidation for speed and SEO.
- **API / server actions** — page CRUD, publish, media, analytics ingest, AI generation, admin.
- **Admin** — role-gated `/admin` area.

### The load-bearing decision

A page is a **JSON block-tree**, stored as two snapshots — `draftContent` and
`publishedContent`. Simple Mode, Advanced Mode, and the AI builder all produce the
**same** JSON, and a single `PublicPageRenderer` renders both the live editor canvas
and the public page. This keeps three builders + draft/publish from becoming three codebases.

### Supporting services

- **Storage:** S3-compatible + `next/image`.
- **GIF generation:** ffmpeg in an async worker / queue (not inline — serverless time limits).
- **Analytics:** PostHog for product analytics + our own aggregate tables for in-app charts.
- **AI builder:** Anthropic API (Claude) turns a prompt into block JSON.
- **Future:** wildcard subdomains (`username.useaura.me`) and custom domains via a
  `Domain` table + `proxy.ts` (Next 16's renamed middleware) — left as hooks, not built.

## Data model (entities)

| Entity | Purpose | Key fields |
|---|---|---|
| `User` | account | id, email, passwordHash?, name, **username (unique)**, avatarUrl, role (`USER`/`ADMIN`), status (`ACTIVE`/`SUSPENDED`) |
| `Account`/`Session`/`VerificationToken` | Auth.js standard | provider, tokens, expiry |
| `Page` | a landing page | id, userId, slug, title, status (`DRAFT`/`PUBLISHED`), themeId, **draftContent (JSON)**, **publishedContent (JSON)**, seoTitle, seoDescription, ogImage, isPrimary, publishedAt |
| `Template` | starter pages | id, name, category, previewImage, content (JSON), isFeatured |
| `ThemePreset` | Theme Engine | id, name, tokens (JSON) |
| `MediaAsset` | uploads | id, userId, type (`IMAGE`/`VIDEO`/`GIF`/`FILE`), url, thumbnailUrl, sizeBytes, meta (JSON) |
| `Form`/`FormSubmission` | form builder | form ↔ page/block; submissions store JSON |
| `PageView` | view events | id, pageId, ts, referrer, country, device |
| `LinkClick` | click events | id, pageId, blockId, targetUrl, ts, referrer, country, device |
| `AnalyticsDaily` | fast charts | pageId, date, views, uniques, clicks |
| `Domain` *(stub)* | future custom domains | id, userId, hostname, verified |
| `AdminAuditLog` | moderation trail | actorId, action, targetType, targetId, ts |

Blocks are **not** a table — they live inside `Page` JSON.

## User flows

1. **Onboard:** sign up → claim username → empty dashboard with one "Create your AURA" prompt.
2. **Create a page:** Simple (template → customize → publish) · Advanced (blank → blocks → publish) · AI (describe → generate → refine → publish).
3. **Edit & publish:** autosave to draft → preview → Publish revalidates `/[username]`.
4. **Visitor:** `useaura.me/[username]` → SSR page → view/click events captured.
5. **Analytics:** dashboard reads `AnalyticsDaily` → charts.
6. **Admin:** role gate → search/suspend/delete users → pages overview → platform stats → moderation.

## Page map

- **Public:** `/` · `/examples` · `/login` · `/signup` · `/[username]` · `/legal/*`
- **App (auth):** `/dashboard` · `/dashboard/{analytics,templates,media,settings}` · `/builder/[pageId]` · `/builder/[pageId]/preview`
- **Admin:** `/admin` · `/admin/users` · `/admin/users/[id]` · `/admin/pages` · `/admin/analytics` · `/admin/moderation`

## Component map

- **Primitives (shadcn-style):** Button, Input, Card, Dialog, Sheet, Tabs, Tooltip, DropdownMenu, Toast, Avatar, Badge, Switch, Slider, ColorPicker.
- **Brand layer:** `AuraButton` (glow), `GlowSurface`, `GradientText`, `Reveal`, `AuraLogo`/`AuraMark`.
- **Marketing:** Hero, FeatureGrid, TemplateShowcase, HowItWorks, TestimonialsPlaceholder, Footer.
- **Dashboard:** AppShell/Sidebar, `PageCard` (live thumbnail), MetricTile, AnalyticsChart, MediaGrid, EmptyState.
- **Builder:** BuilderCanvas, BlockLibraryPanel, StyleInspector, DeviceToggle, ThemePicker, DragHandle, Toolbar.
- **Blocks (render + edit):** Hero, CTA, LinkButton, Gallery, SocialLinks, FAQ, Testimonials, ProductCard, ContactForm, Video, Text, FeatureGrid, **DynamicLinkCard**, File, Presentation, **Gif**.
- **Renderer:** `PublicPageRenderer` (JSON → block components), reused by the builder canvas.
- **Admin:** AdminTable, UserRow, StatCard, ModerationQueue.
