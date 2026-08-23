# Logging & error handling

Logging and error handling are **centralized**. Do not use raw `console.*` or
return ad-hoc error shapes from API routes.

## Logging — `@repo/logger`

A zero-dependency structured logger. Pretty output in development, single-line
JSON in production. Safe in Node, edge and browser runtimes.

```ts
import { logger } from "@repo/logger";

const log = logger.child("campaigns:api"); // scope every log line

log.info("Listing campaigns", { userId });
log.warn("Rate limit approaching", { remaining });
log.error("Failed to send", { error: serializeError(err) });
```

Guidelines:

- **Scope** each logger to its module/feature via `logger.child("scope")`.
- Pass structured **fields** (objects), not string-concatenated context.
- Levels: `debug` (dev detail), `info` (notable events), `warn` (expected/
  recoverable problems), `error` (unexpected failures).
- Control verbosity with `LOG_LEVEL` (server) or `NEXT_PUBLIC_LOG_LEVEL`
  (client). Defaults: `debug` in dev, `info` in production.
- Use `serializeError(unknown)` to safely log thrown values.

## Errors — `AppError` taxonomy

Defined in `apps/product/lib/errors.ts`. Throw these from application/transport
code; each carries an HTTP `statusCode` and a stable `code`.

| Class                      | Status | `code`                  |
| -------------------------- | ------ | ----------------------- |
| `ValidationError`          | 400    | `validation_error`      |
| `UnauthorizedError`        | 401    | `unauthorized`          |
| `NotFoundError`            | 404    | `not_found`             |
| `ConflictError`            | 409    | `conflict`              |
| `UnprocessableEntityError` | 422    | `unprocessable_entity`  |
| `AppError` (base)          | 500\*  | `internal_error`\*      |

\* defaults; override via constructor options.

**Domain errors stay in the domain.** Translate them to `AppError` subclasses at
the API boundary:

```ts
try {
  await createCampaign(input);
} catch (error) {
  if (error instanceof CampaignValidationError) {
    throw new UnprocessableEntityError(error.message);
  }
  throw error;
}
```

## API routes — `withApiHandler`

Wrap every route handler. It provides a single try/catch that logs and maps
errors to a consistent JSON body.

```ts
import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";

export const GET = withApiHandler("campaigns", async () => {
  const { listCampaigns } = getCampaignService();
  return NextResponse.json(await listCampaigns());
});
```

Error responses always look like:

```json
{ "error": { "code": "validation_error", "message": "Invalid request", "details": { } } }
```

Mapping performed automatically:

- `ZodError` → `400` (`validation_error`) with flattened issues.
- `AppError` → its `statusCode`/`code` (logged at `warn` for 4xx, `error` for 5xx).
- Anything else → `500` `internal_error` (logged at `error`; message not leaked).

## React error boundaries

Each app defines:

- `app/error.tsx` — recoverable route errors (offers "Try again").
- `app/global-error.tsx` — catastrophic errors (renders its own `<html>`).
- `app/not-found.tsx` — 404 UI.

All log via `@repo/logger`. Keep boundary UI minimal and dependency-light.
