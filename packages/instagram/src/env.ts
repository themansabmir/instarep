import { z } from "zod";

const instagramEnvSchema = z.object({
  INSTAGRAM_APP_ID: z.string().min(1),
  INSTAGRAM_APP_SECRET: z.string().min(1),
  INSTAGRAM_REDIRECT_URI: z.string().url(),
  INSTAGRAM_API_BASE_URL: z.string().url().default("https://graph.instagram.com"),
  INSTAGRAM_API_VERSION: z.string().default("v21.0"),
  TOKEN_ENCRYPTION_KEY: z.string().min(1),
  META_WEBHOOK_VERIFY_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type InstagramEnv = z.infer<typeof instagramEnvSchema>;

let cached: InstagramEnv | undefined;

export function getInstagramEnv(): InstagramEnv {
  if (cached) return cached;

  const parsed = instagramEnvSchema.safeParse({
    INSTAGRAM_APP_ID: process.env.INSTAGRAM_APP_ID,
    INSTAGRAM_APP_SECRET: process.env.INSTAGRAM_APP_SECRET,
    INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI,
    INSTAGRAM_API_BASE_URL: process.env.INSTAGRAM_API_BASE_URL ?? "https://graph.instagram.com",
    INSTAGRAM_API_VERSION: process.env.INSTAGRAM_API_VERSION ?? "v21.0",
    TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
    META_WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Missing or invalid Instagram environment variables: ${missing}`);
  }

  cached = parsed.data;
  return cached;
}
