# Architecture

## Monorepo topology

```
apps/
  web/       Marketing website (public, SEO-first)
  product/   SaaS application (private, feature-first)
packages/
  ui/        Design-system primitives (shadcn/ui)
  config/    ESLint + TypeScript config
  logger/    Structured logger
```

Managed with **pnpm workspaces** (packages) and **Turborepo** (task running +
caching). Internal packages are referenced with `workspace:*` and consumed by
apps via `transpilePackages` (no separate build step for packages).

## Dependency rules

Allowed:

```
web      → packages/ui, packages/logger, packages/config
product  → packages/ui, packages/logger, packages/config
```

Forbidden:

```
web → product        product → web        (never import across apps)
```

If two apps genuinely need the same code, extract it into a **new scoped
package** with a single clear responsibility. Do not create catch-all
`shared` / `common` / `utils` packages.

## Independent deployability

Each app has its own build, env, and runtime config and can be deployed
separately:

```
www.example.com → apps/web
app.example.com → apps/product
```

Being in one repo must never couple their deployments.

## Product: feature-first + hexagonal (when warranted)

Product code is organized by **feature**, not by technical type. Avoid global
`components/ hooks/ services/ api/ types/ utils/` dumping grounds.

```
apps/product/
  app/          Routing, layouts, loading/error boundaries, API routes (thin)
  components/    Product-wide components only (AppSidebar, DashboardHeader, ...)
  features/
    <feature>/   Everything the feature owns
  lib/           Cross-cutting app utilities (env, query-client, errors, api)
```

### Architecture scales with complexity

- **Simple feature** → keep it flat:

  ```
  features/billing/
    components/
    data/
  ```

- **Complex feature** → use hexagonal layers (reference: `features/campaigns`):

  ```
  features/campaigns/
    domain/          Entities, value objects, ports (interfaces), domain errors
    application/      Use cases that depend on ports
    infrastructure/   Adapters (repositories) + composition root
    presentation/     Schemas, API client, hooks (TanStack Query), components
  ```

Do **not** force four layers into every feature.

### The dependency direction

```
Presentation ─▶ Application ─▶ Domain ◀─ Infrastructure
```

- **Domain** depends on nothing external (no React/Next/DB/Stripe/OpenAI).
- **Application** (use cases) depends only on domain **ports** (interfaces).
- **Infrastructure** implements those ports (in-memory now; Postgres/Prisma
  later) and is wired in one **composition root** per feature
  (`infrastructure/<feature>-module.ts`).
- **Presentation** and **API routes** call use cases; they never reach into
  infrastructure directly.

This is what makes the future `apps/api` (NestJS) / `apps/worker` extraction
cheap: the domain and application layers move without change.

### Thin API routes

`app/api/*/route.ts` handlers only handle transport (parse, authorize, status
codes) and delegate to use cases. Wrap them in `withApiHandler` for centralized
logging and error mapping. See [logging-and-errors.md](./logging-and-errors.md).

## Marketing (`apps/web`) is intentionally simpler

No domain/application/infrastructure layering. Structure:

```
apps/web/
  app/          Routes, layouts, SEO route handlers (sitemap, robots, OG)
  components/    Header/footer/theme
  config/        site config (single source of truth)
  features/      marketing sections (hero, pricing, faq)
  lib/           env, seo (metadata factory, JSON-LD helpers)
```

Its priorities are content, conversion, SEO, performance and accessibility.

## When to add an abstraction

Add an interface/port/adapter/factory only when it creates a **real boundary**
you will cross (e.g. swappable persistence, an external provider). Do not add
repositories, DI containers or layers "because Clean Architecture has them".
Prefer clear ownership over eliminating every duplication.
