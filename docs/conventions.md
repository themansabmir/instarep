# Conventions

## Language & tooling

- **TypeScript, strict.** No `any`; prefer `unknown` + narrowing. Types are
  checked with `pnpm typecheck` (must be clean).
- **ESLint** runs with `--max-warnings 0`. Formatting is owned by **Prettier**
  (do not fight it; run `pnpm format`).
- Use **`import type`** / inline `type` for type-only imports
  (`verbatimModuleSyntax` is on).

## Files & naming

- Files and folders: `kebab-case` (`campaign-table.tsx`, `create-campaign.ts`).
- React components: `PascalCase`. Hooks: `useThing`. Functions/vars:
  `camelCase`. Types/interfaces: `PascalCase`.
- One primary export per file where practical; name the file after it.
- Tests live next to the code: `*.test.ts(x)`. E2E specs live in `e2e/`.

## Imports

- Use the `@/*` path alias inside an app (e.g. `@/features/...`,
  `@/lib/...`). Use package names for workspace packages
  (`@repo/ui/...`, `@repo/logger`).
- Import UI primitives from their subpath:
  `import { Button } from "@repo/ui/components/button"`.
- No deep imports across features. If feature A needs feature B's internals,
  that's a design smell — expose a small, intentional surface or lift the shared
  piece up.

## Component levels (product)

1. **Design-system primitive** → `packages/ui` (generic, no business logic).
2. **Product-wide component** → `apps/product/components` (only genuinely
   app-wide: `AppSidebar`, `DashboardHeader`, `UserMenu`, `PageHeader`).
3. **Feature component** → `apps/product/features/<feature>/**/components`.

Most business-specific components belong at the **feature** level. Do not create
a giant global component folder.

## Server vs client

- Default to **Server Components**. Add `"use client"` only when you need
  interactivity, browser APIs, or client hooks.
- Prefer server-side data fetching for initial/render-critical data; use
  **TanStack Query** for client-managed server state (mutations, revalidation,
  polling). Do not wrap everything in Query.
- Distinguish server state / UI state / form state / domain state. Don't reach
  for a global store without a real requirement.

## Data, forms, tables, toasts

- **Forms:** React Hook Form + Zod via `@hookform/resolvers`. Keep schemas close
  to the feature (`presentation/schemas.ts`) unless genuinely shared.
- **Tables:** TanStack Table, kept in the owning feature. No giant generic table
  abstraction.
- **Toasts:** Sonner, used only in the presentation layer. Domain/application
  code must not depend on Sonner.

## Environment variables

- Access via the app's `lib/env.ts` (validated with `@t3-oss/env-nextjs`).
  Never read `process.env` directly in app/feature code.
- Server secrets stay server-side. Only `NEXT_PUBLIC_*` reaches the browser.
- Add new variables to both `env.ts` and the app's `.env.example`.

## Things to avoid

- God components/services/hooks; giant `utils.ts` / `helpers.ts` grab-bags.
- Business logic inside UI primitives.
- Infrastructure (DB/provider) leaking into the domain layer.
- Circular dependencies.
- Premature abstractions, empty layers, or feature folders with no content.
