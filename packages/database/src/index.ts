import { PrismaClient } from "./generated/client";

/**
 * Single Prisma client instance. In development we cache it on `globalThis` to
 * avoid exhausting connections during hot-reload; in production a new client is
 * created once per process.
 *
 * This module is the data-access boundary — import `db` from `@repo/db` in
 * infrastructure/adapters only. Keep it out of the domain layer.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export * from "./generated/client";
