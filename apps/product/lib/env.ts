import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe, validated environment variables for the product application.
 *
 * Server secrets (database URLs, provider keys) belong in `server` and are
 * never exposed to the browser. Client-visible values must be `NEXT_PUBLIC_`.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url(),
    // Example server-only secrets — uncomment as features are added.
    // DIRECT_URL: z.string().url().optional(),
    // STRIPE_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3001"),
    NEXT_PUBLIC_MARKETING_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "production"]).default("development"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },
  emptyStringAsUndefined: true,
});
