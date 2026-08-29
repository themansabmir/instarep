# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. Read
this first, then the relevant file(s) in [`docs/`](./docs/README.md).

## What this repo is

A pnpm + Turborepo monorepo with two independent Next.js (App Router) apps and
shared packages:

- `apps/web` — marketing website (SEO-first, simple).
- `apps/product` — SaaS app (feature-first; hexagonal layers where complexity
  justifies them).
- `packages/ui` — shared shadcn/ui primitives (no business logic).
- `packages/config` — shared ESLint + TypeScript config.
- `packages/logger` — shared structured logger.
- `packages/database` (`@repo/db`) — Prisma schema + client (data-access boundary).

## Non-negotiable rules

1. **Apps never import each other's source.** `web ⇸ product`. Share via a
   scoped `packages/*` package only when there is a real cross-app need.
2. **`packages/ui` holds generic primitives only** — never business components
   (those live in the owning feature).
3. **Feature-first product code:** put code in
   `apps/product/features/<feature>/`. Keep simple features flat; only use
   `domain/application/infrastructure/presentation` layers when complexity
   warrants (see `features/campaigns` for the reference implementation).
4. **Domain stays pure.** No React, Next.js, DB drivers, Stripe, etc. in
   `domain/`. Depend on ports (interfaces); wire adapters in a single
   composition root (`infrastructure/*-module.ts`).
5. **Thin API routes.** `app/api/*` handlers only parse/authorize/respond and
   delegate to use cases. Wrap them with `withApiHandler` (see
   `apps/product/lib/api/handler.ts`).
6. **Errors & logging are centralized.** Throw `AppError` subclasses
   (`apps/product/lib/errors.ts`); log via `@repo/logger` — never raw
   `console.*` in app/feature code.
7. **Validated env only.** Access env through `lib/env.ts` (never
   `process.env` directly in app code). Secrets are server-only; browser values
   must be `NEXT_PUBLIC_*`.
7b. **Database access is boundaried.** Import the Prisma client (`@repo/db` /
   `@/lib/db`) only from a feature's `infrastructure/` layer — never from
   `domain/` or `presentation/`.
8. **Strict quality gates.** Code must pass `pnpm lint`, `pnpm typecheck`,
   `pnpm build`, and `pnpm test`. Lint runs with zero-warnings.

## Before you finish a task

Run and make sure these pass for the affected scope:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Where to look

| Topic                            | Read                                        |
| -------------------------------- | ------------------------------------------- |
| Architecture & dependency rules  | `docs/architecture.md`                      |
| Coding conventions               | `docs/conventions.md`                       |
| Adding a feature (step by step)  | `docs/adding-a-feature.md`                  |
| Logging & error handling         | `docs/logging-and-errors.md`                |
| Database (Prisma / `@repo/db`)   | `docs/database.md`                          |
| SEO (marketing site)             | `docs/seo.md`                               |
| Local setup & commands           | `CONTRIBUTING.md`                           |
