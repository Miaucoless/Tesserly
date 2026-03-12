# New UI Style Guide — Tokens & Component States

This page documents design tokens and component states for **internal screens only**. The homepage is excluded and unchanged.

## Design Tokens (CSS Variables)

Scoped to `#auth-screen`, `#menu-screen`, `#app-screen`.

### Colors (dark theme)

| Token | Default (dark) | Usage |
|-------|----------------|--------|
| `--nui-bg` | `#07090f` | Page background |
| `--nui-bg-subtle` | `#0c0e16` | Inputs, subtle areas |
| `--nui-surface` | `rgba(255,255,255,0.03)` | Cards, panels |
| `--nui-surface-hover` | `rgba(255,255,255,0.06)` | Hover states |
| `--nui-border` | `rgba(93,253,203,0.12)` | Borders |
| `--nui-text` | `#e8eaef` | Primary text |
| `--nui-text-muted` | `#9ca3af` | Secondary text |
| `--nui-accent` | `#5dfdcb` | Primary accent (teal/cyan) |
| `--nui-accent-dim` | `rgba(93,253,203,0.12)` | Accent tint |
| `--nui-warn` | `#f97316` | Warnings |
| `--nui-danger` | `#ef4444` | Errors |

### Spacing (4/8pt scale)

`--nui-space-1` (4px) through `--nui-space-16` (64px).

### Radii

`--nui-radius-sm` (8px), `--nui-radius` (12px), `--nui-radius-lg` (16px), `--nui-radius-full` (9999px).

### Typography

- **Font:** `--nui-font-sans`, `--nui-font-mono`
- **Sizes:** `--nui-text-xs` (11px) through `--nui-text-3xl` (28px)
- **Leading:** `--nui-leading-tight`, `--nui-leading-normal`, `--nui-leading-relaxed`

### Motion

- **Easing:** `--nui-ease` (cubic-bezier)
- **Duration:** `--nui-duration-fast` (150ms), `--nui-duration` (250ms), `--nui-duration-slow` (350ms)
- **Transition:** `--nui-transition` = duration + ease

### Z-index

`--nui-z-dropdown` (100), `--nui-z-sticky` (150), `--nui-z-modal` (200), `--nui-z-toast` (300), `--nui-z-drawer` (250).

---

## Component States

### Buttons (`.nui-btn`, `.nui-btn-primary`, `.nui-btn-secondary`, `.nui-btn-ghost`)

- **Default:** background/border per variant
- **Hover:** glow (primary), background (ghost/secondary)
- **Focus-visible:** 2px outline `--nui-accent`
- **Active:** `transform: scale(0.98)`
- **Disabled:** not styled (use `:disabled`)

### Cards (`.nui-card`, `.nui-card-panel`)

- **Default:** surface border, radius
- **Hover:** `translateY(-4px)` (menu cards), shadow
- **Focus-visible:** 3px accent box-shadow

### Nav items (`.nui-nav-item`)

- **Default:** muted text
- **Hover:** surface-hover, full text color
- **Active:** accent-dim background, accent color
- **Focus-visible:** 2px accent outline

### Form inputs (`.nui-input`)

- **Default:** bg-subtle, border
- **Focus:** border accent, 3px accent box-shadow

### Tabs (`.nui-tab`)

- **Default:** transparent, muted
- **Active:** accent background, dark text

---

## Accessibility

- Focus states use `:focus-visible` and visible outline/box-shadow.
- Interactive cards use `role="button"` and `tabindex="0"`; support Enter/Space.
- Motion respects `@media (prefers-reduced-motion: reduce)` (durations → 0.01ms, transforms disabled where appropriate).

---

## Light theme

When `data-theme="light"` is set on the screen element (or `data-nui-theme="light"` on `body`), tokens switch to light values (e.g. `--nui-bg: #f2f0ec`, `--nui-text: #1a1c28`). Same token names, different values.
