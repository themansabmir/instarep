# Design system — Instabot UI foundation

Record of the global design system and reusable UI package. This is the
foundation every product and marketing screen should consume. It is **not** a
redesign of existing feature pages.

**Status:** Implemented (tokens + primitives + internal showcase)  
**Package:** `@repo/ui` (`packages/ui`)  
**Showcase:** product app `/design-system` (not indexed, not behind auth)

---

## Objective

Establish one visual language for Instabot:

Instagram-native + premium SaaS + AI product — **restrained**, not a generic
purple dashboard and not a clone of Instagram’s proprietary UI.

Brand influence is limited to:

- pink / purple / orange accent system
- media-first and conversational surfaces
- rounded avatars
- sparse gradients and brand moments (~10–20% of UI; ~80–90% neutrals)

---

## What was delivered

### 1. Semantic tokens (single source of truth)

All color, radius, shadow, gradient, typography scale, and motion values live
in [`packages/ui/src/styles/globals.css`](../packages/ui/src/styles/globals.css).

Consuming apps already import that file:

```css
@import "tailwindcss";
@import "@repo/ui/globals.css";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

**Do not hard-code brand hex in components.** Use semantic utilities:

| Use                                           | Not                           |
| --------------------------------------------- | ----------------------------- |
| `bg-primary` / `bg-brand` / `text-foreground` | `bg-[#c13584]`                |
| `bg-gradient-brand` / `bg-gradient-instagram` | inline `linear-gradient(...)` |
| `border-border` / `ring-ring`                 | ad-hoc gray borders           |
| `rounded-md` / `rounded-xl` (from `--radius`) | one-off `rounded-[17px]`      |
| `shadow-xs` / `shadow-md` / `shadow-glow`     | heavy drop shadows            |

Light theme is warm off-white (`#FAF9FB` page, white cards). Dark theme is
designed separately (`#0D0C0F` / `#151318` / `#1B181F`), not an invert.

Instagram-context tokens (`--social-instagram-*`) are for representing an
Instagram surface only — not global chrome.

### 2. shadcn extended, not replaced

Existing shadcn primitives were customized in place (CVA + CSS variables).
New overlays and patterns were added as additional shadcn-style files in
`packages/ui/src/components/`.

### 3. Component inventory

Import from subpaths (same convention as before):

```ts
import { Button } from "@repo/ui/components/button";
```

| File                           | Exports (main)                                                                                                                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `button`                       | `Button` — variants: default/primary, secondary, outline, ghost, destructive, link, brand, gradient. Sizes: xs, sm, default/md, lg, icon, icon-sm. `loading`, `leftIcon`, `rightIcon`, `fullWidth`. `asChild` must wrap a **single** child. |
| `card`                         | `Card` (+ Header/Title/Description/Content/Footer). Variants: default, subtle, elevated, interactive, brand, ai, revenue, outline                                                                                                           |
| `badge`                        | default, secondary, outline, brand, ai, success, warning, destructive, revenue                                                                                                                                                              |
| `input` / `textarea` / `label` | compact product fields; error/success via `state` or `aria-invalid`                                                                                                                                                                         |
| `input-group`                  | `InputGroup`, `SearchInput`, `PasswordInput`                                                                                                                                                                                                |
| `avatar`                       | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`. Sizes xs–2xl. Status: online, active, offline, ai-active. Existing `src` / `fallback` API kept.                                                                                   |
| `layout`                       | `Container` (max-width ~1152px + padding), `Section`, `SectionHeader`, `SectionLabel`, `Stack`, `Inline`, `Grid`, `Divider`                                                                                                                 |
| `section-label`                | re-export of `SectionLabel` (monospace eyebrow: `● AI PERSONA · ACTIVE`)                                                                                                                                                                    |
| `typography`                   | `Display`, `Heading`, `Text`                                                                                                                                                                                                                |
| `ai`                           | `AIStatus`, `PersonaBadge`, `IntentBadge`, `AIIndicator`, `ThinkingIndicator`, `AIMessage`, `AIAvatar`, `AIActivity`, `AIAction`                                                                                                            |
| `conversation`                 | `Conversation`, header, list, bubbles, `UserMessage`, `AIMessage`, `SystemMessage`, `MessageComposer`, `TypingIndicator`, thread, preview                                                                                                   |
| `social`                       | `InstagramPost`, `InstagramReel`, `InstagramStory`, `InstagramComment`, `InstagramProfile`, `SocialMediaPreview` (inspired surfaces, not clones)                                                                                            |
| `media`                        | `MediaCard`, `MediaThumbnail`, `MediaPreview`, `VideoPreview` — ratios 1:1, 4:5, 9:16, 16:9                                                                                                                                                 |
| `commerce`                     | `ProductCard`, `ProductMiniCard`, `OfferCard`, `AffiliateCard`, `RecommendationCard`                                                                                                                                                        |
| `revenue`                      | `RevenueBadge`, `RevenueMetric`, `RevenueCard`, `RevenueEvent`, `RevenuePipeline`, `ConversionIndicator`                                                                                                                                    |
| `data-display`                 | `MetricCard`, `Stat`, `Trend`, `Progress`, `ProgressRing`, `MiniChart`, `Sparkline`, `DataTable` wrapper                                                                                                                                    |
| `navigation`                   | `Navbar`, `TopBar`, `Sidebar`, `SidebarItem`, `Breadcrumb`, `SidebarTrigger`                                                                                                                                                                |
| `command`                      | `CommandMenu` (+ cmdk parts)                                                                                                                                                                                                                |
| `feedback`                     | `EmptyState`, `ErrorState`, `SuccessState`, `LoadingState`                                                                                                                                                                                  |
| `alert` / `alert-dialog`       | inline and modal alerts                                                                                                                                                                                                                     |
| `skeleton`                     | `Skeleton`, conversation/card/table/metric/profile skeletons (shimmer; respects reduced motion)                                                                                                                                             |
| `testimonial`                  | `TestimonialCard`, `TestimonialCarousel`, `LogoCloud`, `CreatorQuote`                                                                                                                                                                       |
| Overlays                       | `dialog` (`Modal` alias), `sheet`, `drawer`, `popover`, `dropdown-menu`, `tooltip`, `context-menu`                                                                                                                                          |
| Also present                   | `tabs`, `table`, `select`, `form`, `sonner`, `accordion`, `separator`, `progress` (`ProgressBar`), `scroll-area`, `theme-toggle`                                                                                                            |

Hook: `@repo/ui/hooks/use-is-mobile`.

### 4. Motion and backgrounds

Reusable animation tokens/classes: `animate-fade`, `fade-up`, `fade-down`,
`scale-in`, `slide-in`, `message-enter`, `ai-thinking`, `intent-detected`,
`revenue-pulse`, `gradient-shift`, `shimmer`, `marquee`.

Optional surfaces: `bg-grid`, `bg-dots`, `bg-gradient-subtle`, `bg-brand-glow`,
`bg-noise`. Use sparingly.

`prefers-reduced-motion` disables those product animations.

### 5. Showcase page

[`apps/product/app/design-system/`](../apps/product/app/design-system/) is an
internal gallery (colors, type, buttons, inputs, cards, avatars, badges, AI,
conversation, social, product, revenue, navigation, feedback, loading, motion).

Run the product app (`pnpm --filter product dev`, port **3001**) and open
`/design-system`. Toggle light/dark with the header control.

### 6. App-level token consumption

- Product and marketing `viewport.themeColor` aligned to background tokens.
- Product sidebar logo mark uses `bg-gradient-instagram` instead of hard-coded
  hex.

Existing feature pages were **not** redesigned.

---

## How to use it

1. **New UI** — compose `@repo/ui` primitives. If a pattern will appear more
   than once, add or extend a primitive in `packages/ui`. If it is
   feature-specific (API, domain, copy tied to one flow), keep it in
   `apps/product/features/<feature>/`.
2. **Tokens** — change `globals.css` to restyle the product globally.
3. **Icons** — Lucide only, sizes 14–24px, should not overpower text.
4. **Empty states** — icon + short heading + one sentence + primary action
   (`EmptyState`).
5. **Business logic** — never in `@repo/ui`. AI/social/revenue components are
   presentational only (props in, no APIs).

```tsx
<Button variant="brand" size="lg" loading={loading} leftIcon={<Sparkles />}>
  Create AI Persona
</Button>

<Avatar src={avatar} fallback="MK" status="active" />

<Badge variant="ai">AI Active</Badge>
```

---

## What was intentionally not built

Authentication, database, Instagram APIs, AI backends, campaigns, real
analytics, real conversations, or new customer-facing product screens.

---

## Quality gates run

| Check                                       | Result                                                  |
| ------------------------------------------- | ------------------------------------------------------- |
| `pnpm --filter @repo/ui typecheck` / `lint` | Pass                                                    |
| Product and web `typecheck` / `lint`        | Pass                                                    |
| Product unit tests                          | Pass                                                    |
| `pnpm --filter web build`                   | Pass (after `Button` `asChild` + Slot single-child fix) |

---

## Related docs

- [architecture.md](./architecture.md) — `packages/ui` as the shared UI package
- [conventions.md](./conventions.md) — import paths and component levels
- [AGENTS.md](../AGENTS.md) — monorepo rules for agents
