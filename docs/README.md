# AURA — planning docs

AURA (UseAura.me) is a premium, no-code platform for building personal landing pages
that feel like mini-websites — for creators, influencers, freelancers, founders, and
small businesses. Think Linktree + Carrd + Framer, but beautiful by default.

The product is **free** (no billing/pricing/tiers), but the architecture is built so
monetization can be added later without a rewrite.

## Approved branding (locked 2026-06-21)

- **Direction:** _Luminous_ — dark-first, glowing, premium. Other directions
  (Editorial Atelier, Kinetic) ship as Theme Engine presets.
- **Palette:** _Deep Space_, as a **dual dark mode**:
  - **Vivid** (default) — neon mint `#00E5A0`, electric blue `#3B82F6`, violet
    `#A855F7` on near-black `#08090C` / surface `#121419`, text `#E8EAED`. Used on
    published pages and marketing.
  - **Muted** (toned-down) — primary `#4FB89C`, secondary `#5C7FB2`, accent
    `#8E7DB4`, bg `#0C0E12`, surface `#161922`, text `#CDD2D8`. Default in the
    editor/dashboard, plus a global toggle.
- **Logo:** _Aura field_ — concentric radiating rings (abstract, animatable, scales to a favicon).
- **Type:** Plus Jakarta Sans (display) + Inter (body/UI). _Note: stand-ins for
  Satoshi / General Sans, which can be swapped in via local fonts later._

## Documents

- [architecture.md](./architecture.md) — system architecture, data model, page map, component map, user flows
- [design-system.md](./design-system.md) — tokens, typography, spacing, motion, components
- [roadmap.md](./roadmap.md) — phased implementation plan + current status

## Tech stack

Next.js (App Router, currently v16) · TypeScript · Tailwind CSS v4 · shadcn-style
components · PostgreSQL + Prisma · Auth.js · S3-compatible storage · PostHog ·
deployed on Vercel.
