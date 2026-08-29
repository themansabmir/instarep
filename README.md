# Instarep

A greenfield SaaS monorepo: a marketing website and an independent product
application, sharing a design-system package. Built with pnpm + Turborepo.

## Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Apps:** Next.js (App Router) + React + TypeScript (strict) + Tailwind CSS v4
- **UI:** shadcn/ui primitives (Radix + CVA) in `packages/ui`
- **Product tooling:** TanStack Query, TanStack Table, React Hook Form, Zod, Sonner
- **Env:** `@t3-oss/env-nextjs` (validated, per-app)
- **Testing:** Vitest (unit/integration) + Playwright (e2e)

## Structure

```
apps/
  web/        Marketing website (SEO-first)
  product/    SaaS application (feature-first + hexagonal where warranted)
packages/
  ui/         Shared design-system primitives (shadcn/ui)
  config/     Shared ESLint + TypeScript configuration
  logger/     Shared structured logger
  database/   Prisma schema + client (@repo/db)
```

Apps are independent and never import each other's source. Anything shared is
extracted into a scoped package under `packages/`.

## Getting started

```bash
pnpm install

# copy env files and adjust as needed
cp apps/web/.env.example apps/web/.env.local
cp apps/product/.env.example apps/product/.env.local

pnpm dev            # run everything
pnpm --filter web dev       # marketing only  (http://localhost:3000)
pnpm --filter product dev   # product only    (http://localhost:3001)
```

## Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Run all apps in dev mode             |
| `pnpm build`        | Build all apps + packages            |
| `pnpm lint`         | Lint the whole workspace             |
| `pnpm typecheck`    | Type-check the whole workspace       |
| `pnpm test`         | Run unit/integration tests (Vitest)  |
| `pnpm test:e2e`     | Run end-to-end tests (Playwright)    |
| `pnpm format`       | Format with Prettier                 |

Per-app builds: `pnpm --filter web build`, `pnpm --filter product build`.

## Architecture notes

- **Feature-first product:** code lives in `apps/product/features/<feature>`.
  Simple features stay flat (`billing`); complex ones use hexagonal layers
  (`campaigns`: `domain` / `application` / `infrastructure` / `presentation`).
- **Dependency inversion:** use cases depend on ports (interfaces); adapters are
  wired in a single composition root per feature (`infrastructure/*-module.ts`).
- **Thin API routes:** `app/api/*` handlers only handle transport and delegate
  to use cases.
- **SEO in `apps/web`:** metadata factory, dynamic sitemap, environment-aware
  robots, and typed JSON-LD helpers.
