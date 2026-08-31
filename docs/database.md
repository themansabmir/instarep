# Database (`@repo/db`)

Persistence lives in a dedicated package, **`packages/database`**, so the domain
and application layers depend on a clear data-access boundary — and so a future
`apps/api` / `apps/worker` can reuse it without moving code.

- **ORM:** Prisma (PostgreSQL).
- **Vector search:** pgvector (`vector(1536)` embeddings on `knowledge_chunks`)
  via the `postgresqlExtensions` preview feature.
- **Client output:** generated into `packages/database/src/generated/client`
  (git-ignored; produced by `prisma generate`).

## Layout

```
packages/database/
  prisma/
    schema.prisma     # single source of truth for the data model
    seed.ts           # idempotent local seed
  src/
    index.ts          # exports the `db` singleton + generated types
    generated/        # prisma client (generated, ignored)
```

## Using it

Import the client only from **infrastructure / adapters** (never domain):

```ts
import { db } from "@repo/db"; // or: import { db } from "@/lib/db"

const workspaces = await db.workspace.findMany();
```

Types (including `Prisma`, model types and enums) are re-exported from
`@repo/db`.

## Environment

`DATABASE_URL` is defined in **`apps/product/.env`** (single source for the product
app and Prisma CLI). Database scripts load that file automatically via
`dotenv-cli`; you can override locally with `packages/database/.env` if needed.

```bash
# apps/product/.env (required)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/instarep?schema=public"
```

Optional: copy `packages/database/.env.example` to `packages/database/.env` only
if you want database-only overrides without touching the product app env.

The database must have pgvector available. With the extension declared in the
schema, `prisma migrate` will run `CREATE EXTENSION IF NOT EXISTS vector`.

## Commands (run from the package or via filter)

```bash
pnpm --filter @repo/db db:generate   # regenerate the client
pnpm --filter @repo/db db:migrate    # create/apply a dev migration
pnpm --filter @repo/db db:deploy     # apply migrations (CI/prod)
pnpm --filter @repo/db db:push       # push schema without a migration (prototyping)
pnpm --filter @repo/db db:studio     # open Prisma Studio
pnpm --filter @repo/db db:seed       # seed local data
```

`prisma generate` also runs automatically as the package's `build` task, so
`pnpm build`/`pnpm typecheck` produce the client before the product app compiles.

## Conventions

- Models are PascalCase singular; tables/columns map to snake_case via
  `@@map`/`@map`.
- UUID primary keys (`@default(uuid()) @db.Uuid`).
- Referential actions: owned children `Cascade`; optional references `SetNull`;
  `SubscriptionPlan` references are `Restrict`.
- Every foreign key is indexed; add composite/unique indexes with `@@index` /
  `@@unique`.
- Status/role-like fields are `varchar` with defaults for MVP flexibility;
  promote to Prisma enums once values stabilize.
- The `embedding` column is a Prisma `Unsupported("vector(1536)")` type — write
  it via raw SQL / a vector helper; it is not part of the typed query API.
