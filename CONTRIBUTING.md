# Contributing to Instarep

Everything you need to set up, run and work on this monorepo locally.

## 1. Prerequisites

| Tool    | Version                | Notes                                          |
| ------- | ---------------------- | ---------------------------------------------- |
| Node.js | `>= 20` (22 preferred) | See `.nvmrc`. Use `nvm use` if you have nvm.   |
| pnpm    | `>= 9`                 | `corepack enable` then `corepack use pnpm@9`.  |
| Git     | any recent version     | Required for hooks (husky).                    |

This repo uses **pnpm workspaces + Turborepo**. Do not use `npm` or `yarn`.

## 2. First-time setup

```bash
# 1. Install all workspace dependencies (also installs git hooks via husky)
pnpm install

# 2. Create local env files from the examples
cp apps/web/.env.example apps/web/.env.local
cp apps/product/.env.example apps/product/.env.local
cp packages/database/.env.example packages/database/.env
```

You need a PostgreSQL database with the **pgvector** extension available. Set
`DATABASE_URL` in both `apps/product/.env.local` and `packages/database/.env`,
then generate the client and apply the schema:

```bash
pnpm --filter @repo/db db:generate   # generate the Prisma client
pnpm --filter @repo/db db:migrate    # create + apply the initial migration
```

On Windows PowerShell, use `Copy-Item apps/web/.env.example apps/web/.env.local` etc.

Environment variables are **validated at build/runtime** via `@t3-oss/env-nextjs`.
If a required variable is missing or malformed, the app fails fast with a clear
message. Never commit real secrets — only `.env.example` files are tracked.

## 3. Running the apps

```bash
pnpm dev                     # run everything (Turborepo)

pnpm --filter web dev        # marketing site  -> http://localhost:3000
pnpm --filter product dev    # product app     -> http://localhost:3001
```

The two apps are **independent** and can be started, built and deployed
separately.

## 4. Common commands

| Command            | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `pnpm dev`         | Run all apps in watch mode                      |
| `pnpm build`       | Build every app + package                       |
| `pnpm lint`        | ESLint across the workspace (zero warnings)     |
| `pnpm typecheck`   | Strict TypeScript check across the workspace    |
| `pnpm test`        | Unit/integration tests (Vitest)                 |
| `pnpm test:e2e`    | End-to-end tests (Playwright)                   |
| `pnpm format`      | Format the repo with Prettier                   |

Scope any task to one workspace with `--filter`, e.g.
`pnpm --filter product test`.

## 5. Project layout

```
apps/
  web/       Marketing website (SEO-first)
  product/   SaaS application (feature-first + hexagonal where warranted)
packages/
  ui/        Shared shadcn/ui design-system primitives
  config/    Shared ESLint + TypeScript config
  logger/    Shared structured logger
  database/  Prisma schema + client (@repo/db)
docs/        Architecture, conventions and AI contributor guidelines
```

> Read [`docs/`](./docs/README.md) before making non-trivial changes — it
> describes the architecture and the conventions this project expects.

## 6. Development workflow

1. Create a branch: `git checkout -b feat/<short-description>`.
2. Make your change, following [`docs/conventions.md`](./docs/conventions.md).
3. Run `pnpm lint && pnpm typecheck && pnpm test` locally.
4. Commit. A **husky pre-commit hook** runs `lint-staged` (Prettier) on staged
   files automatically.
5. Open a pull request.

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(campaigns): add pause action to campaign table
fix(web): correct canonical URL on pricing page
docs: document logger usage
chore(deps): bump next to 15.x
```

## 7. Adding dependencies

- Add to the specific workspace that needs it:
  `pnpm --filter product add <pkg>`.
- Shared tooling/config belongs in `packages/*`.
- Every dependency should have a clear reason. Prefer the platform/framework
  before adding a library.

## 8. Troubleshooting

| Symptom                              | Fix                                                            |
| ------------------------------------ | ------------------------------------------------------------- |
| Type or module errors after `git pull` | `pnpm install`                                              |
| Stale build/cache issues             | `pnpm clean` then `pnpm install`                              |
| Env validation error on boot         | Check your `.env.local` against the matching `.env.example`   |
| Tailwind classes from `@repo/ui` not applied | Ensure the app `globals.css` keeps its `@source` line |
