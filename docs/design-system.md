# Design system

## Tokens (dual dark mode)

Tokens are **semantic**, defined as CSS variables in `src/app/globals.css` and mapped
into Tailwind v4 via `@theme inline`. Both modes share token names, so components are
written once.

| Token | Tailwind util | Vivid | Muted |
|---|---|---|---|
| `--bg` | `bg-bg` | `#08090C` | `#0C0E12` |
| `--surface` | `bg-surface` | `#121419` | `#161922` |
| `--surface-2` | `bg-surface-2` | `#1A1D24` | `#1F232E` |
| `--primary` | `bg-primary` / `text-primary` | `#00E5A0` | `#4FB89C` |
| `--primary-ink` | `text-primary-ink` | `#053D2C` | `#08251B` |
| `--secondary` | `bg-secondary` | `#3B82F6` | `#5C7FB2` |
| `--accent` | `text-accent` | `#A855F7` | `#8E7DB4` |
| `--text` | `text-text` | `#E8EAED` | `#CDD2D8` |
| `--text-muted` | `text-text-muted` | `#9AA3AF` | `#8B939F` |
| `--border` | `border-border` | `#232734` | `#262B36` |

**Switching modes:** add `data-mode="muted"` to any wrapper element; the subtree
re-themes via CSS. The marketing/public site is Vivid by default; the dashboard layout
wraps its tree in `data-mode="muted"`.

## Signature effect

`.aura-glow` — a soft radial halo (`box-shadow`) behind primary CTAs and active
elements. It is **only active in Vivid**; Muted flattens it to nothing. Used sparingly.
`.aura-backdrop` adds a faint radial light behind hero sections (Vivid only).

## Typography

- **Display:** Plus Jakarta Sans (`font-display`) — headlines. Sizes ~64/48/32/24.
- **Body / UI:** Inter (`font-sans`) — 18/16/14 body, 14/13/12 UI.
- **Weights:** 400 and 500 only. Tight headline tracking, ~1.6 body line-height.
- _Stand-ins for Satoshi / General Sans; swappable via `next/font/local` later._

## Spacing & shape

- 4px base grid: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Radii: pill (full) for buttons, `rounded-xl`/`rounded-3xl` for inputs/cards,
  `--radius` (14px) as the brand default.
- Hairline 0.5–1px borders using `--border`.

## Motion

- Reveal-on-scroll (fade + ~12px rise), spring drag in the builder, slow parallax on
  hero media, 150ms ease on interactive states. Respect `prefers-reduced-motion`.

## Components built in Phase 0

- `src/components/aura-logo.tsx` — `AuraMark` (rings) + `AuraLogo` (wordmark).
- `src/components/ui/button.tsx` — `Button` + `buttonClasses()` (primary/secondary/ghost · sm/md/lg).
- `src/components/ui/input.tsx` — `Input`.
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge).
