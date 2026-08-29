# Documentation

Project documentation for contributors — human and AI. These documents describe
**how this codebase is meant to be built and extended**. Treat them as the
source of truth for architecture and conventions.

> AI agents: start from [`../AGENTS.md`](../AGENTS.md), then read the relevant
> document below before making non-trivial changes.

## Index

| Document                                       | Purpose                                                    |
| ---------------------------------------------- | ---------------------------------------------------------- |
| [architecture.md](./architecture.md)           | Monorepo layout, boundaries, Clean/Hexagonal architecture  |
| [conventions.md](./conventions.md)             | Coding standards, naming, imports, component levels        |
| [adding-a-feature.md](./adding-a-feature.md)   | Step-by-step playbook for adding a product feature         |
| [logging-and-errors.md](./logging-and-errors.md) | How to log and handle errors consistently               |
| [database.md](./database.md)                   | Prisma data-access package (`@repo/db`)                    |
| [seo.md](./seo.md)                             | SEO infrastructure for the marketing site                  |

## Golden rules (TL;DR)

1. One repo, independent apps — never import across `apps/*`.
2. Feature-first; architecture scales with complexity.
3. Shared UI = generic primitives only (`packages/ui`).
4. Domain logic is framework-agnostic; infrastructure is swappable behind ports.
5. Centralized logging (`@repo/logger`) and errors (`AppError` + `withApiHandler`).
6. Validated, scoped env — no raw `process.env` in app code.
7. Every dependency and abstraction must earn its place. No premature layers.
