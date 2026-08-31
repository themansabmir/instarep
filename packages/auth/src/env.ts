import { z } from "zod";

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true" || value === "1"),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1).optional(),
  EMAIL_OTP_DEV_FALLBACK: z
    .string()
    .optional()
    .transform((value) => value === "true" || value === "1"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type AuthEnv = z.infer<typeof authEnvSchema>;

let cached: AuthEnv | undefined;

export function getAuthEnv(): AuthEnv {
  if (cached) return cached;

  const parsed = authEnvSchema.safeParse({
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_OTP_DEV_FALLBACK: process.env.EMAIL_OTP_DEV_FALLBACK,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Missing or invalid auth environment variables: ${missing}`);
  }

  cached = parsed.data;
  return cached;
}
