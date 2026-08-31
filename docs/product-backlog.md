# Instarep — Product Backlog (Epics & User Stories)

> **Product in one line:** _An AI sales agent for your Instagram._ When someone
> comments on a creator's Instagram post, Instarep automatically sends them a DM
> and an AI "avatar" continues the conversation — answering questions from the
> creator's knowledge base, qualifying the person, and capturing them as a lead.
>
> **Core promise:** One workspace, **many AI agents (avatars)**, connected to
> **many Instagram accounts** — with everything metered and gated by the
> workspace's **subscription plan** and **credit balance**.

This document is the single source of truth for _what_ we are building and _why_.
It is grounded in the data model in
[`packages/database/prisma/schema.prisma`](../packages/database/prisma/schema.prisma).
Each epic lists the tables it touches so engineering and product stay aligned.

---

## 1. Personas

| Persona                                                    | Who they are                              | Primary goals                                                         |
| ---------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| **Influencer / Owner** (`User` who owns a `Workspace`)     | The creator/brand who signs up.           | Connect IG accounts, build agents, grow & convert leads on autopilot. |
| **Team member** (`WorkspaceMember`, role `member`/`admin`) | Someone invited into a workspace.         | Manage agents, monitor chats, handle leads — scoped by role.          |
| **Prospect / IG user** (external, not a `User`)            | The person who comments/DMs on Instagram. | Get a fast, helpful answer; buy or sign up.                           |
| **Superadmin** (`AdminUser`)                               | Instarep's internal operators.            | Oversee all influencers, revenue, subscriptions, and platform health. |

---

## 2. Glossary (product term → schema)

| Product term          | Schema model(s)                                        | Notes                                                     |
| --------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| Workspace / Account   | `Workspace`, `WorkspaceMember`                         | The tenant boundary. Everything is scoped to a workspace. |
| AI Agent / Avatar     | `Avatar`                                               | Personality, tone, language, system prompt, greeting.     |
| Instagram account     | `InstagramAccount`                                     | OAuth-connected IG business/creator account.              |
| Knowledge base        | `KnowledgeBase`, `KnowledgeDocument`, `KnowledgeChunk` | Source material + embeddings (`vector(1536)`) for RAG.    |
| Automation (Auto-DM)  | `Automation`, `AutomationExecution`                    | Trigger (e.g. comment) → action (send DM / hand to AI).   |
| Comment intelligence  | `InstagramComment`                                     | Ingested comments with sentiment/intent/AI analysis.      |
| Conversation / Chat   | `Conversation`, `ConversationMessage`                  | The DM thread the AI runs, message-by-message.            |
| Lead                  | `Lead`                                                 | A prospect captured/qualified from a conversation.        |
| Plan / Subscription   | `SubscriptionPlan`, `Subscription`                     | Plan limits + the workspace's active subscription.        |
| Payment               | `Payment`                                              | Charges from the payment provider.                        |
| Credits               | `CreditAccount`, `CreditTransaction`                   | Metered AI usage wallet (ledger).                         |
| Notifications & Email | `Notification`, `EmailEvent`                           | In-app + transactional email.                             |
| Analytics             | `AnalyticsEvent`                                       | Event stream powering dashboards.                         |
| Superadmin & audit    | `AdminUser`, `AuditLog`                                | Platform operations + change history.                     |

---

## 3. Plan gating — the rule that touches everything

Almost every "create" action must respect the workspace's current plan and credit
balance. Enforce these limits centrally (a shared "entitlements" check), not
per-feature:

| Limit (on `SubscriptionPlan`) | Gates                          | Enforced when                      |
| ----------------------------- | ------------------------------ | ---------------------------------- |
| `maxInstagramAccounts`        | Connecting `InstagramAccount`s | Before OAuth connect completes     |
| `maxKnowledgeBases`           | Creating `KnowledgeBase`s      | Before create                      |
| `maxConversations`            | Active/period `Conversation`s  | Before starting a new conversation |
| `includedCredits`             | AI usage (`CreditTransaction`) | Refilled each billing period       |
| `features` (JSON)             | Feature flags per plan         | At feature entry points            |

> There is **no plan-level cap on the number of `Avatar`s** in the schema today.
> Decide product-side whether agents are unlimited or gated via `features`
> (see **US-4.6**).

---

## 4. Epics index

| #   | Epic                                      | Primary tables                                         | Phase       |
| --- | ----------------------------------------- | ------------------------------------------------------ | ----------- |
| E1  | Authentication & Onboarding               | `User`, `Workspace`, `AdminUser`                       | MVP         |
| E2  | Influencer Workspace & Account Management | `Workspace`, `WorkspaceMember`, `User`                 | MVP         |
| E3  | Instagram Integration                     | `InstagramAccount`                                     | MVP         |
| E4  | Avatar Builder (AI Agents)                | `Avatar`                                               | MVP         |
| E5  | Knowledgebase Management                  | `KnowledgeBase`, `KnowledgeDocument`, `KnowledgeChunk` | MVP         |
| E6  | RAG Retrieval                             | `KnowledgeChunk`, `ConversationMessage`                | MVP         |
| E7  | Instagram Comment Intelligence            | `InstagramComment`                                     | MVP         |
| E8  | Auto-DM Automation                        | `Automation`, `AutomationExecution`                    | MVP         |
| E9  | AI Conversation Engine                    | `Conversation`, `ConversationMessage`                  | MVP         |
| E10 | Agent UI / Chat View                      | `Conversation`, `ConversationMessage`                  | MVP         |
| E11 | Leads & Conversion                        | `Lead`                                                 | MVP         |
| E12 | Notifications & Email                     | `Notification`, `EmailEvent`                           | MVP         |
| E13 | Dashboard & Analytics                     | `AnalyticsEvent` (+ aggregates)                        | MVP         |
| E14 | Subscription & Plans                      | `SubscriptionPlan`, `Subscription`                     | MVP         |
| E15 | Payment Gateway Integration               | `Payment`, `Subscription`                              | MVP         |
| E16 | Credit System                             | `CreditAccount`, `CreditTransaction`                   | MVP         |
| E17 | Superadmin Console                        | `AdminUser`, `AuditLog`, all read models               | MVP/Phase 2 |
| E18 | Platform Foundations (cross-cutting NFRs) | All                                                    | Ongoing     |

Story IDs follow `US-<epic>.<n>`. Priority uses MoSCoW (**M**ust / **S**hould /
**C**ould / **W**on't-yet).

---

## E1 — Authentication & Onboarding

**Goal:** Let a creator sign up, land in a ready-to-use workspace, and reach the
"aha" moment (first connected account + first agent) as fast as possible.
**Tables:** `User`, `Workspace`, `AdminUser`.

- **US-1.1 (M) Sign up with email/password.**
  _As a creator, I want to create an account so I can start using Instarep._
  - Given valid email + password, a `User` is created with `passwordHash` and `status = "active"`.
  - Duplicate email is rejected (unique `email`) with a clear message.
  - A default `Workspace` is created and the user becomes its `owner`.
- **US-1.2 (M) Log in / log out.**
  - Valid credentials start a session; `lastLoginAt` is updated.
  - Invalid credentials fail generically (no user enumeration).
- **US-1.3 (S) Password reset.**
  - Request triggers an `EmailEvent` (type `password_reset`); token is single-use and expiring.
- **US-1.4 (S) Guided onboarding checklist.**
  _As a new owner, I want a step list (connect IG → create knowledge base → build agent → set automation) so I know what to do next._
  - Checklist reflects real state and disappears when complete.
- **US-1.5 (C) OAuth sign-in (Google).** `passwordHash` stays null for OAuth users.
- **US-1.6 (M) Superadmin flag.** A `User` can be linked to an `AdminUser` to unlock the superadmin console (E17).

---

## E2 — Influencer Workspace & Account Management

**Goal:** A workspace is the tenant. Owners manage profile, team, and workspace
settings; everything else is scoped to the active workspace.
**Tables:** `Workspace`, `WorkspaceMember`, `User`.

- **US-2.1 (M) View & edit my profile.** Update `name`, `avatarUrl`; change password.
- **US-2.2 (M) View & edit workspace settings.** Update `name`, `timezone`; `slug` is unique and used in URLs.
- **US-2.3 (S) Switch between workspaces.** A user in multiple workspaces (via `WorkspaceMember`) can switch the active one; all data re-scopes.
- **US-2.4 (S) Invite team members.** Invite by email → creates/links `User` + `WorkspaceMember` (`status = "invited"` → `active` on accept), respecting the unique `(workspaceId, userId)`.
- **US-2.5 (S) Role-based access.** Roles `owner` / `admin` / `member` gate destructive actions (delete workspace, manage billing, remove members).
- **US-2.6 (C) Remove / suspend a member.** Set `WorkspaceMember.status`; owner cannot be removed.
- **US-2.7 (C) Delete workspace.** Cascades to all workspace-owned data (as defined by `onDelete: Cascade`); requires explicit confirmation.

---

## E3 — Instagram Integration

**Goal:** Connect one or many Instagram accounts per workspace (up to plan limit),
keep tokens fresh, and receive events (comments/DMs) via webhooks.
**Tables:** `InstagramAccount`.

- **US-3.1 (M) Connect an Instagram account via OAuth.**
  - Successful OAuth stores `instagramUserId` (unique), `username`, profile fields, and an **encrypted** `accessTokenEncrypted` with `tokenExpiresAt`; `status = "connected"`, `connectedAt` set.
  - **Plan gate:** block if connected count ≥ `plan.maxInstagramAccounts` with an upgrade prompt.
- **US-3.2 (M) List connected accounts.** Show avatar, username, followers, status, last sync.
- **US-3.3 (M) Disconnect an account.** Set `status = "disconnected"`, `disconnectedAt`; pause dependent automations.
- **US-3.4 (M) Token refresh & expiry handling.** Auto-refresh before `tokenExpiresAt`; on failure set `status = "expired"` and notify owner (E12).
- **US-3.5 (M) Webhook ingestion.** Receive IG webhooks for comments/DMs, verify signature, and route to comment intelligence (E7) / conversations (E9). Idempotent on `instagramCommentId` / `instagramMessageId`.
- **US-3.6 (S) Sync profile stats.** Periodically refresh `followersCount`, `followingCount`, `mediaCount`.
- **US-3.7 (S) Reconnect flow.** One-click re-auth for expired accounts, preserving history.

---

## E4 — Avatar Builder (AI Agents)

**Goal:** Let creators build multiple AI sales agents with distinct personality,
tone, language, and behavior — the heart of the "make as many agents" promise.
**Tables:** `Avatar`.

- **US-4.1 (M) Create an avatar.** Set `name`, `description`, `personality`, `tone`, `language` (default English), `systemPrompt`, `greetingMessage`.
- **US-4.2 (M) Edit / duplicate an avatar.** Duplicate to iterate quickly.
- **US-4.3 (M) Activate / deactivate.** `isActive` controls whether it can be assigned to automations/conversations.
- **US-4.4 (M) List avatars.** Show name, tone, language, active status, usage (linked automations/conversations).
- **US-4.5 (S) Test the avatar (sandbox chat).** Chat with the avatar in-app (optionally against a selected knowledge base) before going live.
- **US-4.6 (S) Plan-aware agent limits.** Decide whether the number of avatars is unlimited or gated via `plan.features`; enforce at create time.
- **US-4.7 (C) Prompt templates / presets.** Starter personalities (e.g. "Course seller", "Coach", "E‑com support").
- **US-4.8 (C) Attach default knowledge base per avatar.** Convenience default when wiring automations/conversations.

---

## E5 — Knowledgebase Management

**Goal:** Give agents accurate, creator-specific knowledge by ingesting documents,
URLs, and text, then chunking + embedding them for retrieval.
**Tables:** `KnowledgeBase`, `KnowledgeDocument`, `KnowledgeChunk`.

- **US-5.1 (M) Create a knowledge base.**
  - **Plan gate:** block if count ≥ `plan.maxKnowledgeBases`.
- **US-5.2 (M) Add documents (upload / URL / pasted text).** Create `KnowledgeDocument` with `sourceType` (`file` / `url` / `text`), `fileUrl` / `sourceUrl` / `content`; start `status = "pending"`.
- **US-5.3 (M) Ingestion pipeline.** Extract text → chunk → embed (`vector(1536)`) → store `KnowledgeChunk`s with `chunkIndex`, `tokenCount`. Move document `status` `pending → processing → ready` (or `failed` with reason).
- **US-5.4 (M) Deduplicate re-uploads.** Skip/replace using `contentHash`.
- **US-5.5 (M) View documents & processing status.** Show per-document status, chunk count, and errors.
- **US-5.6 (S) Delete a document / knowledge base.** Cascades to chunks; reflect immediately in retrieval.
- **US-5.7 (S) Re-index a document.** Re-run ingestion when content changes.
- **US-5.8 (C) Metadata & tags.** Use `metadata` JSON for source, section, tags to improve retrieval filtering.

---

## E6 — RAG Retrieval

**Goal:** For each incoming user message, retrieve the most relevant knowledge
chunks so the AI answers accurately and grounded.
**Tables:** `KnowledgeChunk` (vector search), `ConversationMessage` (traceability).

- **US-6.1 (M) Vector similarity search.** Given a query embedding, return top-k `KnowledgeChunk`s via pgvector (cosine/inner product) scoped to the relevant knowledge base(s).
- **US-6.2 (M) Ground answers in retrieved context.** Inject retrieved chunks into the prompt; store `retrievedChunkIds` on the resulting `ConversationMessage` for traceability.
- **US-6.3 (S) Relevance threshold & fallback.** If no chunk clears a similarity threshold, fall back to a safe "I'm not sure / handoff" response instead of hallucinating.
- **US-6.4 (S) Multi-knowledge-base scope.** Retrieve across the KBs linked to the active avatar/automation.
- **US-6.5 (C) Citations in chat view.** Surface which document/section an answer came from (internal view).
- **US-6.6 (C) Retrieval quality metrics.** Log hit rates / avg similarity via `AnalyticsEvent` for tuning.

---

## E7 — Instagram Comment Intelligence

**Goal:** Ingest comments and understand them (sentiment, intent, language) so
automations can respond smartly, not just on keywords.
**Tables:** `InstagramComment`.

- **US-7.1 (M) Ingest comments.** From webhooks (E3.5), upsert `InstagramComment` (unique `instagramCommentId`) with `commentText`, media/user refs, `commentedAt`.
- **US-7.2 (M) AI classification.** Populate `sentiment`, `intent`, `language`, and rich `aiAnalysis` (JSON) — e.g. "buying intent", "pricing question", "spam".
- **US-7.3 (M) Trigger matching.** Match comments to automations (E8) by keyword/media/intent per `Automation.triggerConfig`.
- **US-7.4 (S) Comment inbox.** Browse/filter comments by account, media, sentiment, intent; see whether an automation fired.
- **US-7.5 (S) Spam / abuse filtering.** Skip auto-DM for spam/toxic comments.
- **US-7.6 (C) Manual reply / trigger.** Let a team member manually kick off a DM from a comment.

---

## E8 — Auto-DM Automation

**Goal:** The signature workflow — comment triggers an automatic DM, optionally
handing the conversation to an AI avatar. Fully configurable and observable.
**Tables:** `Automation`, `AutomationExecution`.

- **US-8.1 (M) Create an automation.** Choose `instagramAccount`, optional `avatar`, `triggerType` (e.g. `comment`), `triggerConfig` (keywords, media, intent), `responseMode` (`ai` / `static`), optional `maxMessagesPerUser`.
- **US-8.2 (M) Automation lifecycle.** `status` `draft → active → paused`; only `active` ones fire.
- **US-8.3 (M) Execute on trigger.** On a matching comment, create an `AutomationExecution` (`status` `pending → running → completed/failed`), send the first DM, and (if `responseMode = ai`) open a `Conversation` (E9).
- **US-8.4 (M) Respect per-user caps.** Enforce `maxMessagesPerUser`; do not spam the same `instagramUserId`.
- **US-8.5 (M) Credit & plan checks before firing.** Skip/queue execution if credits are exhausted or plan limits hit; log the reason in `errorMessage` and notify (E12).
- **US-8.6 (S) Execution history & retries.** View executions with timing (`startedAt`, `completedAt`), status, errors; retry failed ones.
- **US-8.7 (S) Static (non-AI) DM mode.** Send a fixed templated DM without invoking the AI (cheaper; still logged).
- **US-8.8 (C) Rate limiting & IG compliance guards.** Throttle sends to respect Instagram messaging policies/windows.
- **US-8.9 (C) A/B test opening messages.** Compare greeting variants by conversion.

---

## E9 — AI Conversation Engine

**Goal:** Run the ongoing DM conversation: generate grounded, on-persona replies,
track the thread, and meter usage.
**Tables:** `Conversation`, `ConversationMessage` (+ `Avatar`, `KnowledgeChunk`, `CreditTransaction`).

- **US-9.1 (M) Open/continue a conversation.** Create a `Conversation` (workspace, IG account, automation, avatar, `instagramUserId`) or resume an existing active one; set `startedAt`, keep `lastMessageAt` fresh.
- **US-9.2 (M) Persist every message.** Store inbound and outbound `ConversationMessage`s with `role` (`user`/`assistant`/`system`), `content`, `messageType`, `instagramMessageId`.
- **US-9.3 (M) Generate AI replies.** Compose system prompt (avatar) + RAG context (E6) + history → model reply; store `aiModel`, `tokenUsage`, `retrievedChunkIds`.
- **US-9.4 (M) Deliver replies to Instagram.** Send via IG API; handle failures/retries and reflect status.
- **US-9.5 (M) Meter usage → credits.** Each AI response debits `CreditAccount` via a `CreditTransaction` (E16), sized by `tokenUsage`.
- **US-9.6 (M) Conversation state.** Manage `status` (`active` / `closed`) and `leadStatus` (`new` → …); auto-close on inactivity with `closedAt`.
- **US-9.7 (S) Handoff / pause AI.** Let a human take over a thread (pause AI) and resume later.
- **US-9.8 (S) Guardrails.** Refuse out-of-scope/unsafe content; enforce max turns; graceful fallback when no context (ties to US-6.3).
- **US-9.9 (C) Multi-language replies.** Respect the avatar `language` and/or detected `Conversation.source` language.

---

## E10 — Agent UI / Chat View

**Goal:** A clean inbox where the creator/team can watch and intervene in live AI
conversations across all accounts and agents.
**Tables:** `Conversation`, `ConversationMessage`.

- **US-10.1 (M) Conversation inbox.** List conversations with filters (account, avatar, status, lead status), sorted by `lastMessageAt`, with unread indicators.
- **US-10.2 (M) Thread view.** Read the full message history with roles, timestamps, and message types.
- **US-10.3 (S) Human takeover from the UI.** Pause AI (US-9.7) and send a manual message that persists as an `assistant` message with a "human" marker in `metadata`.
- **US-10.4 (S) Close / reopen conversation.** Update `status`/`closedAt`; optionally set `leadStatus`.
- **US-10.5 (S) Live updates.** New messages appear in near real-time (polling/subscriptions).
- **US-10.6 (C) Internal notes & tags.** Annotate a conversation (store in `metadata`) for the team.
- **US-10.7 (C) Search.** Search conversations by IG username/content.

---

## E11 — Leads & Conversion

**Goal:** Turn conversations into a lightweight CRM so creators see the business
value (leads captured & converted).
**Tables:** `Lead` (+ `Conversation`).

- **US-11.1 (M) Auto-create leads.** When a conversation shows intent, create/update a `Lead` (workspace, conversation, `instagramUserId`, `username`) with `status = "new"`.
- **US-11.2 (M) Lead pipeline.** Move `status` (`new` → `qualified` → `converted` / `lost`); set `convertedAt` on conversion.
- **US-11.3 (S) Leads list & detail.** Filter by status/source; open the originating conversation.
- **US-11.4 (S) Capture structured data.** Store email/phone/custom fields in `metadata`.
- **US-11.5 (C) Export / webhook out.** CSV export or push leads to external CRM.

---

## E12 — Notifications & Email

**Goal:** Keep users informed in-app and by email about important events.
**Tables:** `Notification`, `EmailEvent`.

- **US-12.1 (M) In-app notifications.** Create `Notification`s for key events (IG token expired, credits low, payment failed, new lead); show unread badge; mark read via `readAt`.
- **US-12.2 (M) Transactional email.** Send + log `EmailEvent`s (welcome, password reset, receipts, dunning) with provider + `providerMessageId` and delivery `status`.
- **US-12.3 (S) Delivery status tracking.** Update `EmailEvent.status` from provider webhooks (sent/delivered/bounced/failed).
- **US-12.4 (S) Notification preferences.** Per-user/workspace toggles for which events notify by email vs in-app.
- **US-12.5 (C) Digest emails.** Daily/weekly summary of conversations, leads, credits.

---

## E13 — Dashboard & Analytics

**Goal:** Show creators the impact — comments handled, DMs sent, conversations,
leads, conversion, and credit burn — from a single event stream.
**Tables:** `AnalyticsEvent` (+ aggregates over other tables).

- **US-13.1 (M) Emit analytics events.** Record `AnalyticsEvent`s for meaningful actions (comment ingested, DM sent, conversation started, lead created/converted, credits spent) with references.
- **US-13.2 (M) Workspace dashboard.** KPI cards: connected accounts, active automations, conversations (period), leads, conversion rate, credits used/remaining.
- **US-13.3 (S) Trends over time.** Charts for conversations/leads/credit usage by day/week; filter by IG account and avatar.
- **US-13.4 (S) Per-agent & per-account breakdown.** Compare performance across avatars and accounts.
- **US-13.5 (C) Date-range & export.** Custom ranges and CSV export.

---

## E14 — Subscription & Plans

**Goal:** Sell tiered plans that define limits and included credits; let workspaces
subscribe, upgrade, downgrade, and cancel.
**Tables:** `SubscriptionPlan`, `Subscription`.

- **US-14.1 (M) Browse plans.** Show plans (`price`, `currency`, `billingInterval`) and limits (`maxInstagramAccounts`, `maxKnowledgeBases`, `maxConversations`, `includedCredits`, `features`); only `isActive` plans are purchasable.
- **US-14.2 (M) Subscribe to a plan.** Create a `Subscription` (via provider, E15) with `status`, `currentPeriodStart/End`; grant `includedCredits` to the wallet (E16).
- **US-14.3 (M) Enforce plan limits everywhere.** Central entitlements check backs the gates in E3/E5/E9 (see §3).
- **US-14.4 (M) Upgrade / downgrade.** Change plan with proration handled by the provider; re-evaluate limits (warn if current usage exceeds a downgrade's limits).
- **US-14.5 (M) Cancel / resume.** Set `cancelAtPeriodEnd` / `canceledAt`; retain access until period end.
- **US-14.6 (M) Renewal via webhooks.** On provider renewal, roll `currentPeriodStart/End` and refill period credits.
- **US-14.7 (S) Free trial / free tier.** A default plan applied on signup (limits + trial credits).
- **US-14.8 (S) Billing page.** Current plan, renewal date, usage vs limits, and invoice history (from `Payment`).

---

## E15 — Payment Gateway Integration

**Goal:** Take payments reliably via a provider (e.g. Stripe) and keep billing state
in sync through webhooks.
**Tables:** `Payment`, `Subscription`.

- **US-15.1 (M) Checkout.** Start provider checkout for a selected plan; on success create/activate the `Subscription`.
- **US-15.2 (M) Record payments.** Persist `Payment`s (`provider`, `providerPaymentId`, `amount`, `currency`, `status`, `paymentType`, `paidAt`) linked to workspace + subscription.
- **US-15.3 (M) Webhook processing (idempotent).** Handle `payment_succeeded`, `payment_failed`, `subscription_updated/canceled`; idempotent on `providerPaymentId` / `providerSubscriptionId`.
- **US-15.4 (M) Dunning on failure.** On failed payment, notify (E12) and manage ret/grace; suspend on final failure.
- **US-15.5 (S) Manage payment method.** Update card via provider portal/customer session.
- **US-15.6 (S) Invoices / receipts.** Downloadable receipts; email via `EmailEvent`.
- **US-15.7 (C) Multi-currency & tax.** Respect `currency`; provider-side tax handling.

---

## E16 — Credit System

**Goal:** Meter AI usage with a transparent wallet + ledger so costs are controlled
and visible; sell top-ups.
**Tables:** `CreditAccount`, `CreditTransaction`.

- **US-16.1 (M) One wallet per workspace.** Ensure a single `CreditAccount` (unique `workspaceId`) with `balance` + `lifetimeCredits`.
- **US-16.2 (M) Grant credits.** On subscribe/renew, credit `includedCredits` via a `CreditTransaction` (`transactionType = "grant"`) and update `balance`/`balanceAfter`.
- **US-16.3 (M) Debit on AI usage.** Every AI reply (E9) writes a `debit` transaction referencing the conversation/message (`referenceType`/`referenceId`); never allow balance to go negative.
- **US-16.4 (M) Block/degrade at zero.** When `balance <= 0`, pause AI responses & automations (E8.5) and prompt to upgrade/top-up.
- **US-16.5 (M) Ledger view.** Show transaction history with running `balanceAfter` and reasons.
- **US-16.6 (S) Buy top-up credits.** One-time purchase (E15) adds a `purchase` transaction.
- **US-16.7 (S) Low-balance alerts.** Notify (E12) at configurable thresholds.
- **US-16.8 (C) Usage estimates.** Show approximate credits per conversation/agent to help planning.

---

## E17 — Superadmin Console

**Goal:** Give Instarep operators visibility and control over all influencers,
revenue, subscriptions, and platform health — with an audit trail.
**Tables:** `AdminUser`, `AuditLog`, and read access across all models.

- **US-17.1 (M) Admin authentication & guard.** Only `User`s with an active `AdminUser` can access `/admin`; all routes guarded by role.
- **US-17.2 (M) Total influencers overview.** Count and list all workspaces/owners with status, plan, signup date, activity.
- **US-17.3 (M) Superadmin dashboard.** Platform KPIs: total influencers, active subscriptions, MRR/revenue, credits consumed, conversations/leads across all tenants.
- **US-17.4 (M) Payments oversight.** Search/browse all `Payment`s; filter by status/provider/date; view failed payments & refunds.
- **US-17.5 (M) Subscriptions oversight.** View all `Subscription`s by plan/status; see renewals, cancellations, churn.
- **US-17.6 (S) Plan management.** Create/edit `SubscriptionPlan`s (limits, price, features, `isActive`).
- **US-17.7 (S) Workspace drill-down.** Inspect a single workspace's accounts, agents, usage, and billing for support.
- **US-17.8 (S) Manual actions.** Suspend/reactivate a workspace or user; grant courtesy credits (writes a `CreditTransaction`).
- **US-17.9 (M) Audit logging.** Record admin actions in `AuditLog` (`action`, `entityType`, `entityId`, `oldValues`, `newValues`, `ipAddress`).
- **US-17.10 (C) Impersonation (read-only).** Safely view a tenant's app to reproduce issues (audited).

---

## E18 — Platform Foundations (cross-cutting / non-functional)

**Goal:** The invariants that keep the product secure, reliable, and compliant.
Applies across all epics.

- **US-18.1 (M) Strict multi-tenancy.** Every query is scoped to `workspaceId`; no cross-tenant leakage. Add automated tests for isolation.
- **US-18.2 (M) Secret encryption.** Encrypt IG `accessTokenEncrypted` at rest; never log tokens or PII.
- **US-18.3 (M) Webhook security & idempotency.** Verify signatures (IG + payment provider); process every webhook idempotently.
- **US-18.4 (M) Background jobs / queue.** Ingestion, embeddings, DM sends, and AI replies run on a resilient queue with retries and dead-letter handling.
- **US-18.5 (M) Centralized errors & logging.** Use `AppError` + `withApiHandler` and `@repo/logger`; no raw `console.*` (see `docs/logging-and-errors.md`).
- **US-18.6 (S) Rate limiting & abuse protection.** Protect public/webhook/auth endpoints.
- **US-18.7 (S) Data lifecycle & GDPR.** Support data export/delete for a workspace and end-user data requests.
- **US-18.8 (S) Observability.** Metrics/traces for queue depth, AI latency, credit burn, webhook failures.
- **US-18.9 (M) Quality gates.** `pnpm lint && pnpm typecheck && pnpm test && pnpm build` green before merge (see `AGENTS.md`).

---

## 5. Suggested MVP slice (the "golden path")

To ship the core promise fastest, prioritize this end-to-end flow:

1. **E1/E2** — Sign up → workspace ready.
2. **E14/E16** — Assign a default/free plan → grant starter credits.
3. **E3** — Connect one Instagram account (respect plan limit).
4. **E4** — Build one avatar.
5. **E5/E6** — Create a knowledge base, ingest a doc, enable retrieval.
6. **E7/E8** — Comment on a post → automation fires → auto-DM sent.
7. **E9/E10** — AI continues the chat (grounded), visible in the inbox; credits debit.
8. **E11/E13** — Lead captured; dashboard shows it.
9. **E15** — Upgrade to a paid plan when limits/credits run out.
10. **E17 (thin)** — Superadmin can see total influencers, subscriptions, payments.

Everything marked **S/C** is fast-follow once this loop is proven.

---

## 6. Open product decisions (need a call)

1. **Agent limits:** unlimited avatars, or gate via `plan.features`? (US-4.6)
2. **Conversation limit semantics:** does `maxConversations` mean _active_, _per period_, or _lifetime_? (affects E9/E14 enforcement)
3. **Credit pricing model:** credits per AI message vs per 1K tokens (`tokenUsage`)? (E16)
4. **Team seats:** are `WorkspaceMember` seats plan-gated? (not in schema today)
5. **Trial:** length + trial credit grant. (US-14.7)
6. **Instagram API tier:** which Meta permissions/product (IG Messaging vs Graph) — impacts E3/E8 compliance guards.
