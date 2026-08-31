import { betterAuth, type Auth as BetterAuthInstance } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { magicLink } from "better-auth/plugins";

import { db } from "@repo/db";
import { logger } from "@repo/logger";

import { sendMagicLinkEmail, sendPasswordResetEmail } from "./email";
import { getAuthEnv } from "./env";

const authLogger = logger.child("auth");

function buildTrustedOrigins(appUrl: string): string[] {
  const origins = new Set<string>();

  try {
    origins.add(new URL(appUrl).origin);
  } catch {
    // ignore invalid URL
  }

  const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL;
  if (marketingUrl) {
    try {
      origins.add(new URL(marketingUrl).origin);
    } catch {
      // ignore invalid URL
    }
  }

  return [...origins];
}

function createAuth() {
  const env = getAuthEnv();

  return betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins: buildTrustedOrigins(env.BETTER_AUTH_URL),
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendPasswordResetEmail({ email: user.email, url, userId: user.id });
      },
      onExistingUserSignUp: async ({ user }) => {
        const accountCount = await db.account.count({ where: { userId: user.id } });
        if (accountCount === 0) {
          await db.user.delete({ where: { id: user.id } });
          authLogger.warn("Removed orphaned user from incomplete signup", {
            userId: user.id,
            email: user.email,
          });
        }
      },
    },
    plugins: [
      magicLink({
        expiresIn: 60 * 60 * 24,
        sendMagicLink: async ({ email, url }) => {
          const user = await db.user.findUnique({
            where: { email },
            select: { id: true },
          });
          await sendMagicLinkEmail({ email, url, userId: user?.id });
        },
      }),
    ],
    user: {
      modelName: "user",
      fields: {
        image: "avatarUrl",
      },
      additionalFields: {
        status: {
          type: "string",
          required: false,
          defaultValue: "active",
          input: false,
        },
        lastLoginAt: {
          type: "date",
          required: false,
          input: false,
        },
      },
    },
    session: {
      modelName: "session",
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    account: {
      modelName: "account",
    },
    verification: {
      modelName: "verification",
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
    advanced: {
      database: {
        generateId: () => crypto.randomUUID(),
      },
    },
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-in/email" || ctx.path === "/magic-link/verify") {
          const userId = ctx.context.newSession?.user?.id;
          if (!userId) return;

          await db.user.update({
            where: { id: userId },
            data: { lastLoginAt: new Date() },
          });

          authLogger.info("User signed in", { userId, method: ctx.path });
        }
      }),
    },
  }) as unknown as BetterAuthInstance;
}

type AuthInstance = BetterAuthInstance;

let authInstance: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  if (!authInstance) {
    authInstance = createAuth();
  }
  return authInstance;
}

export type Auth = AuthInstance;
