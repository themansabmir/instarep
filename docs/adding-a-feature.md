# Adding a product feature

A practical playbook. Start simple; only add layers when the feature earns them.

## 1. Decide the complexity

- **Simple** (CRUD-ish, mostly presentational): keep it flat.
- **Complex** (real business rules, external providers, swappable persistence):
  use hexagonal layers.

## 2. Scaffold

Simple feature:

```
features/<feature>/
  components/
  data/            (or schemas.ts for validation)
```

Complex feature:

```
features/<feature>/
  domain/          entities + ports (interfaces) + domain errors
  application/      use cases (functions that take a port)
  infrastructure/   adapter(s) + <feature>-module.ts (composition root)
  presentation/     schemas.ts, api.ts, hooks/, components/
```

## 3. Build the complex feature (reference: `campaigns`)

1. **Domain** (`domain/`)
   - Define the entity/types and any pure rules (no framework imports).
   - Define a **port**: `export interface XRepository { ... }`.
   - Define domain errors extending `Error`.

2. **Application** (`application/`)
   - Write use cases as factories that receive the port:
     `export function makeCreateX(repo: XRepository) { return async (input) => { ... } }`.
   - Enforce invariants here (or in the domain), before persistence.

3. **Infrastructure** (`infrastructure/`)
   - Implement the port with a concrete adapter (in-memory now).
   - Add a **composition root** `` `<feature>-module.ts` `` that constructs the
     adapter once and exposes wired use cases via `getXService()`.

4. **Presentation** (`presentation/`)
   - `schemas.ts`: Zod schemas for inputs (reuse domain constants).
   - `api.ts`: thin `fetch` client + query keys.
   - `hooks/`: TanStack Query `useQuery`/`useMutation`; toast via Sonner here.
   - `components/`: tables (TanStack Table), forms (RHF), views.

5. **API route** (`app/api/<feature>/route.ts`)
   - Wrap handlers with `withApiHandler("<feature>", ...)`.
   - Parse with the Zod schema (let `ZodError` bubble → 400).
   - Translate domain errors into `AppError` subclasses at the boundary.
   - Delegate to `getXService()` use cases. Keep it thin.

6. **Page** (`app/(app)/<feature>/page.tsx`)
   - Compose feature components. For render-critical data, fetch on the server
     via the use case; for interactive data, use the feature's Query hooks.

## 4. Wire navigation

Add the route to `apps/product/components/app-sidebar.tsx` if it belongs in the
primary nav.

## 5. Test

- Unit-test domain rules and use cases (use the in-memory adapter).
- Add a component test for critical UI.
- Optionally add an e2e happy-path spec in `e2e/`.

## 6. Verify

```bash
pnpm --filter product lint
pnpm --filter product typecheck
pnpm --filter product test
pnpm --filter product build
```

## Checklist

- [ ] No cross-app or cross-feature deep imports.
- [ ] Domain has no framework/infra imports.
- [ ] Only added layers the feature actually needs.
- [ ] API route is thin and wrapped with `withApiHandler`.
- [ ] Errors use `AppError`; logging uses `@repo/logger`.
- [ ] Env accessed via `lib/env.ts`.
