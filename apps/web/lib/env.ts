import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Type-safe, validated environment variables for the marketing site.
 *
 * Server-only secrets go in `server` and are never bundled for the client.
 * Anything the browser needs must be prefixed with `NEXT_PUBLIC_` and declared
 * in `client`.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3001"),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "preview", "production"]).default("development"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },
  emptyStringAsUndefined: true,
});
