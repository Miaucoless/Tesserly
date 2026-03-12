# New UI Migration — Internal Screens Only

This document maps **legacy internal components/screens** to the **new UI** implementation. The **homepage** (`#landing-screen`) is **unchanged** (byte-for-byte); only auth, menu (dashboard), and app content use the new design system.

## Design System Location

- **Tokens:** `src/components/new-ui/design-tokens.css`  
  Scoped to `#auth-screen`, `#menu-screen`, `#app-screen`. Variables use `--nui-*` prefix. Typography matches homepage: Instrument Serif, Geist, Geist Mono; radii 9/14px; spacing and motion aligned with landing.

- **Components & layout:** `src/components/new-ui/app-internal.css`  
  Imports tokens; defines AppShell, NavDrawer, Header, PageSection, StatTile, Card, FeatureCard, Accordion/FAQ, Modal, Toast, Tabs, DataTable, Tooltip, ProgressBar, EmptyState, Skeleton, FormField, etc.

- **Style guide:** `src/components/new-ui/style-guide.html`  
  Standalone page showing tokens + component states. Open in browser for reference. Excludes homepage.

- **Entry point:** `Tesserly.html` includes one link:  
  `<link rel="stylesheet" href="components/new-ui/app-internal.css">`  
  No homepage file is modified.

## Old → New Mapping (markup)

| Old (legacy / revamp)     | New (nui) |
|---------------------------|-----------|
| `.revamp-page`, `.fade-up` | `.nui-page`, `.nui-fade-in` |
| `.revamp-page-head`        | `.nui-page-head` |
| `.revamp-page-title`       | `.nui-page-title` |
| `.revamp-page-sub`         | `.nui-page-sub` |
| `.revamp-section`          | `.nui-section` |
| `.revamp-section-title`   | `.nui-section-title` |
| `.revamp-section-desc`     | `.nui-section-desc` |
| `.revamp-anki-source`, `.revamp-anki-form` | `.nui-card-panel`, `.nui-form-field` |
| `.revamp-deck-card`        | `.nui-feature-card`, `.nui-reveal` |
| `.revamp-mode-btn`         | `.nui-tab-btn` (`.nui-tabs-row`) |
| `.card` (content area)     | `.nui-card-panel` or `.nui-feature-card` |
| `.label`                   | `.nui-label` |
| `.revamp-hint`             | `.nui-hint` |
| `.input`                   | `.nui-input` (when inside #app-screen) |
| `.score-bar-track` / `.score-bar-fill` | `.nui-progress-bar`, `.nui-progress-fill` |
| FAQ toggle                 | `.nui-faq-item`, `.nui-faq-q`, `.nui-faq-a`, `.nui-faq-chevron` |

All IDs (`#q-note-sel`, `#anki-results`, `#sum-tree`, `#cal-body`, `#pad-folder-list`, etc.) and `onclick` / behavior are **unchanged**.

## Screen Mapping

| Route / area      | New UI structure                          | Behavior preserved |
|-------------------|-------------------------------------------|--------------------|
| **Auth**          | `#auth-screen.nui`, `.nui-auth-box`, `.nui-auth-card`, `.nui-tabs`, `.nui-form-field`, `.nui-input`, `.nui-btn-primary` | Sign in / sign up, `switchAuthTab`, `doLogin`, `doSignup` |
| **Dashboard**     | `#menu-screen.nui`, `.nui-header`, `.nui-hero`, `.nui-stat-grid`, `.nui-stat-tile`, `.nui-cards-grid`, `.nui-card` | `goToApp(id)`, stats, exam countdown |
| **App shell**     | `#app-screen.nui`, `.nui-sidebar`, `.nui-sidebar-nav`, `.nui-main`, `.nui-topbar`, `.nui-content` | `navigate()`, `renderSidebar()`, topbar actions |
| **USMLE Practice**| `renderQuestions_v6`: `.nui-page`, `.nui-section`, `.nui-card-panel`, `.nui-form-field`, `.nui-label`, `.nui-input`. `renderQResults`: `.nui-section`, `.nui-progress-bar`, `.q-card.nui-reveal`, `.nui-badge`, `.q-explanation` (nui tokens in CSS) | Generate, reset, clear history; same IDs |
| **Flashcards**    | `.nui-page`, `.nui-section`, `.nui-feature-card` (decks), `.nui-tabs-row`, `.nui-tab-btn`, `.nui-card-panel`, `.anki-card` (nui tokens), study view `.nui-page`, `.nui-feature-card` | Custom/cloze/basic, generate, save, study, export |
| **Summarize**     | `.nui-page`, `.nui-section`, `.nui-card-panel`, `.nui-form-field`, `.nui-feature-card` (prompt examples) | Tree, style/length, generate; same IDs |
| **Calendar**      | `.nui-page`, `.nui-card-panel` (connect card, calendar, event form, upcoming) | Events, add/edit/delete, ICS import |
| **Pads**          | `.nui-page`, `.nui-page-title`, `.nui-card-panel`, `.nui-empty-state` | Folders, pads, open/delete |
| **Videos**        | `.nui-page`, `.nui-card-panel`, `.nui-section-title`, `.nui-feature-card` (channels), `.nui-input` | Search, AI topics, channels, quick topics |
| **Notes**         | Same structure; `#content` uses nui-content padding/max-width | Folders, tree, editor, import |
| **Settings**      | `#settings-panel` (unchanged structure)   | Toggle, theme, API key |
| **Profile**       | Same IDs / handlers                      | Unchanged |

## Component Class Reference (New UI)

Use under `#auth-screen.nui`, `#menu-screen.nui`, or `#app-screen.nui` only:

- **Layout:** `.nui-page`, `.nui-page-head`, `.nui-page-title`, `.nui-page-sub`, `.nui-section`, `.nui-section-title`, `.nui-section-desc`, `.nui-content`, `.nui-sidebar`, `.nui-main`, `.nui-topbar`, `.nui-header`, `.nui-hero`
- **Cards:** `.nui-card`, `.nui-card-panel`, `.nui-feature-card`, `.nui-feature-card-icon`, `.nui-feature-card-title`, `.nui-feature-card-text`
- **Stats:** `.nui-stat-grid`, `.nui-stat-tile`, `.nui-stat-val`, `.nui-stat-label`, `.nui-stat-num` (optional `data-target`, `data-suffix` for animated counter)
- **Forms:** `.nui-form-field`, `.nui-label`, `.nui-hint`, `.nui-input`, `.nui-tabs-row`, `.nui-tab-btn`
- **Buttons:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` (existing); nui tokens apply in app screen
- **FAQ / Accordion:** `.nui-faq-list`, `.nui-faq-item`, `.nui-faq-q`, `.nui-faq-a`, `.nui-faq-chevron` (toggle `.open` on item)
- **Modal / Toast:** `.nui-modal-overlay`, `.nui-modal`, `.nui-toast` (`.show`)
- **Data / UI:** `.nui-badge`, `.nui-progress-bar`, `.nui-progress-fill`, `.nui-table-wrap`, `.nui-table`, `.nui-empty-state`, `.nui-skeleton`, `.nui-tooltip`
- **Motion:** `.nui-fade-in`, `.nui-reveal` (add `.in-view` when in viewport; `nuiObserveReveals()` does this)

## Scroll reveal & animated counters

- **Script:** In `Tesserly.html`, `window.nuiObserveReveals()` runs on load and after `navigate()`. It only observes elements inside `#app-screen` and `#menu-screen` (never `#landing-screen`).
- **Scroll reveal:** Elements with `.nui-reveal` get `.in-view` when they enter the viewport (IntersectionObserver). Use `opacity`/`transform` transition in CSS.
- **Animated counters:** Elements with `.nui-stat-num` and `data-target="123"` (optional `data-suffix="+"`) animate from 0 to target when in view. Respects `prefers-reduced-motion: reduce`.

## Feature Parity

- **USMLE Practice:** Generation, note selection, custom prompt, reset, clear history, results, explanations — no logic or API changes.
- **Flashcards:** Decks, custom/cloze/basic modes, generate, save to deck, study view, export — unchanged.
- **Notes & Summaries:** Folders, tree, editor, summarize tree, style/length — unchanged.
- **Calendar:** Events, ICS import, add/edit/delete — unchanged.
- **Search & filters:** Global search, semantics — unchanged.
- **Auth & sync:** Flows and Supabase usage — unchanged.

All existing `onclick`, `id`, and `STATE` usage remain; only markup classes and visual styling were added or updated for internal screens.
