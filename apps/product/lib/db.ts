/**
 * Data-access boundary for the product app. Import the Prisma client from here
 * (or directly from `@repo/db`) inside feature *infrastructure* layers only —
 * never from domain or presentation code.
 */
export { db } from "@repo/db";
export type { Prisma } from "@repo/db";
