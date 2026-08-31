# Epic 1 — Customer Onboarding & Instagram Connection

Sprint record for the first vertical slice of Instabot: account creation,
workspace isolation, Instagram OAuth, and webhook foundation.

**Status:** Implemented (MVP foundation)  
**Product name in UI:** Instabot (repo/package name remains `instarep`)

---

## Objective

Prove the end-to-end path:

Sign Up → Verify Email → Login → Workspace Created → Connect Instagram →
OAuth Callback → Token Encrypted → Account Stored → Webhook Receives Event →
Event Persisted → Queued → Worker Processes

---

## What was delivered

### Story 1 — User registration

| Item               | Implementation                                                       |
| ------------------ | -------------------------------------------------------------------- |
| Auth provider      | Better Auth (`@repo/auth`) with Prisma adapter                       |
| Email/password     | Signup with min 8-char password, duplicate email rejected            |
| Email verification | Required before accessing product routes                             |
| Email delivery     | Nodemailer + SMTP (verification + password reset)                    |
| UI                 | `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`    |
| Rate limiting      | Better Auth rate limit on auth endpoints                             |
| Audit              | `EmailEvent` rows logged on send success/failure (no tokens in logs) |
| Tests              | `features/auth/schemas.test.ts`                                      |

### Story 2 — Login / logout / session

| Item             | Implementation                                       |
| ---------------- | ---------------------------------------------------- |
| Login UI         | Wired to Better Auth client                          |
| Session cookies  | Better Auth session model                            |
| Route protection | `middleware.ts` + `(app)` layout guards              |
| Unverified users | Redirect to `/verify-email`                          |
| Logout           | User menu → `signOut()`                              |
| `lastLoginAt`    | Updated on successful `/sign-in/email` via auth hook |
| Tests            | Auth schema + error mapping tests                    |

### Story 3 — Workspace creation

| Item          | Implementation                                        |
| ------------- | ----------------------------------------------------- |
| Onboarding UI | `/onboarding` — create workspace form                 |
| API           | `POST /api/workspaces`, `GET /api/workspaces/current` |
| Slug          | `slugifyWorkspaceName()` with collision retry         |
| Transaction   | Workspace + `WorkspaceMember` (role `owner`) atomic   |
| Authorization | `requireWorkspaceMember()`, `getActiveWorkspace()`    |
| Settings      | Workspace name/timezone on `/settings`                |
| Tests         | `lib/workspace.test.ts` (slug helper)                 |

### Story 4 — Instagram OAuth connection

| Item           | Implementation                                                         |
| -------------- | ---------------------------------------------------------------------- |
| Package        | `@repo/instagram` — OAuth, token exchange, API client                  |
| Flow           | Connect → Meta authorize → callback → long-lived token → profile fetch |
| State          | `OAuthState` model, crypto random state, 10-minute TTL                 |
| Token security | AES-256-GCM encryption before `InstagramAccount` persistence           |
| UI             | `/onboarding/instagram`, `/settings/instagram`                         |
| API            | `/api/instagram/connect`, `/callback`, `/accounts`, `/disconnect`      |
| Errors         | Mapped to safe `InstagramError` codes (no raw Meta errors to users)    |
| Docs           | [instagram-setup.md](./instagram-setup.md)                             |

### Story 5 — Instagram connection management

| Item                | Implementation                                                    |
| ------------------- | ----------------------------------------------------------------- |
| Connection card     | Username, display name, avatar, followers, status, connected date |
| Disconnect          | Clears encrypted token, status `DISCONNECTED`                     |
| Reconnect           | Reuses OAuth flow (upsert account)                                |
| Operational guard   | `isAccountOperational()` — only `CONNECTED` accounts are usable   |
| Token never exposed | API responses omit `accessTokenEncrypted`                         |

### Story 6 — Webhook foundation

| Item             | Implementation                                                            |
| ---------------- | ------------------------------------------------------------------------- |
| Endpoint         | `GET/POST /api/webhooks/instagram`                                        |
| Verification     | `META_WEBHOOK_VERIFY_TOKEN` handshake                                     |
| Persistence      | `InstagramWebhookEvent` with unique `externalEventId`                     |
| Idempotency      | Duplicate `externalEventId` skipped                                       |
| Queue (MVP)      | PostgreSQL status field (`pending` → `processing` → `completed`/`failed`) |
| Fast processing  | Next.js `after()` + Vercel `waitUntil()` after HTTP 200                   |
| Retry safety net | Vercel Cron → `/api/cron/process-webhooks` every 5 minutes                |
| Tests            | `packages/instagram` webhook parser + token-crypto tests                  |

### Story 7 — Security & observability

| Item                      | Implementation                                        |
| ------------------------- | ----------------------------------------------------- |
| Env validation            | `apps/product/lib/env.ts` (Zod, fail fast at startup) |
| Correlation IDs           | `x-request-id` in middleware and API responses        |
| Safe logging              | Sensitive field names redacted in API error logs      |
| Health                    | `GET /api/health` (DB probe)                          |
| Instagram/webhook logging | Structured scopes via `@repo/logger`                  |

---

## New packages

| Package           | Path                 | Role                                             |
| ----------------- | -------------------- | ------------------------------------------------ |
| `@repo/auth`      | `packages/auth`      | Better Auth server, SMTP email, session helpers  |
| `@repo/instagram` | `packages/instagram` | Meta OAuth, encryption, webhooks, queue port     |
| `@repo/db`        | `packages/database`  | Prisma schema + client (extended in this sprint) |

---

## Database changes

New / updated Prisma models:

- `Session`, `Account`, `Verification` (Better Auth)
- `User.emailVerified` (removed `passwordHash` — credentials in `Account`)
- `OAuthState` — Instagram OAuth CSRF state
- `InstagramWebhookEvent` — webhook idempotency + queue state
- `InstagramAccount.status` default → `CONNECTING` (states: `CONNECTING`, `CONNECTED`, `TOKEN_EXPIRING`, `DISCONNECTED`, `ERROR`)

Apply schema:

```bash
pnpm install
pnpm --filter @repo/db db:push
```

`db:*` commands read `DATABASE_URL` from `apps/product/.env`.

---

## Environment variables (product app)

See `apps/product/.env.example`. Required for full Epic 1 flow:

| Variable                                                         | Purpose                                 |
| ---------------------------------------------------------------- | --------------------------------------- |
| `DATABASE_URL`                                                   | PostgreSQL                              |
| `BETTER_AUTH_SECRET`                                             | Session signing (32+ chars)             |
| `BETTER_AUTH_URL`                                                | Same as `NEXT_PUBLIC_APP_URL`           |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` | Auth emails (Gmail SMTP)                |
| `EMAIL_OTP_DEV_FALLBACK`                                         | Dev: log links + tolerate SMTP failures |
| `INSTAGRAM_*`                                                    | Meta app OAuth                          |
| `TOKEN_ENCRYPTION_KEY`                                           | Encrypt Instagram access tokens at rest |
| `META_WEBHOOK_VERIFY_TOKEN`                                      | Webhook subscription verification       |
| `CRON_SECRET`                                                    | Protects cron retry endpoint            |

---

## Email (SMTP / Gmail)

Epic 1 sends email via **Nodemailer** + SMTP for:

1. **Signup email verification**
2. **Password reset**

Configure `SMTP_*` and `EMAIL_FROM` in `apps/product/.env`. For Gmail, use an
[App Password](https://support.google.com/accounts/answer/185833) (not your
account password).

`EMAIL_OTP_DEV_FALLBACK=true` in development logs verification/reset links and
allows signup to continue if SMTP fails.

---

## `TOKEN_ENCRYPTION_KEY`

Instagram **access tokens are secrets**. They are encrypted with AES-256-GCM
before being stored in `instagram_accounts.access_token_encrypted`.

- Generate: `openssl rand -base64 32`
- Store only server-side in `TOKEN_ENCRYPTION_KEY`
- Never sent to the browser or returned in API JSON
- If you lose this key, encrypted tokens cannot be decrypted — users must reconnect Instagram

---

## Intentionally not implemented (later epics)

- Avatar builder, RAG, LLM conversation engine
- Comment intelligence, auto-DM automation
- Billing, credits, dashboard analytics
- Changes to campaigns/billing stub features

---

## Key file map

```
apps/product/
  middleware.ts
  app/api/auth/[...all]/route.ts
  app/api/workspaces/route.ts
  app/api/instagram/*
  app/api/webhooks/instagram/route.ts
  app/api/cron/process-webhooks/route.ts
  app/api/health/route.ts
  app/(onboarding)/*
  features/auth/*
  features/workspace/*
  features/instagram/*
  lib/workspace.ts
  lib/auth.ts

packages/auth/
packages/instagram/
packages/database/prisma/schema.prisma
```

---

## Verification checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm --filter product test` passes
- [ ] `pnpm --filter @repo/instagram test` passes
- [ ] `pnpm --filter @repo/db db:push` applies schema
- [ ] Signup → verification email → login → onboarding → Instagram connect (with Meta app configured)
- [ ] Webhook verify handshake succeeds in Meta dashboard
- [ ] No access tokens in browser network tab or API responses

---

## Follow-ups (backlog)

- Prisma migrations (currently using `db:push` for prototyping)
- Integration tests with mocked Meta HTTP
- RabbitMQ worker adapter when moving off Vercel serverless
- Email verification link testing without real SMTP in CI
