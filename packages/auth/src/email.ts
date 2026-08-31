import { db } from "@repo/db";
import { logger } from "@repo/logger";

import { getAuthEnv } from "./env";
import { getEmailFrom, getSmtpTransporter } from "./smtp";

const emailLogger = logger.child("auth:email");

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  actionUrl: string;
  emailType: "verification" | "password_reset" | "magic_link";
  userId?: string;
}

async function sendAuthEmail({
  to,
  subject,
  html,
  text,
  actionUrl,
  emailType,
  userId,
}: SendEmailOptions): Promise<void> {
  const env = getAuthEnv();
  const isDev = env.NODE_ENV === "development";
  const from = getEmailFrom();

  emailLogger.info("Auth pipeline: SMTP send start", { emailType, to, smtpHost: env.SMTP_HOST });

  if (env.EMAIL_OTP_DEV_FALLBACK && isDev) {
    emailLogger.info("Dev email link (EMAIL_OTP_DEV_FALLBACK)", {
      emailType,
      to,
      actionUrl,
    });
  }

  const smtpStartMs = Date.now();

  try {
    const transporter = getSmtpTransporter();
    const result = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    await db.emailEvent.create({
      data: {
        userId: userId ?? null,
        emailType,
        recipientEmail: to,
        provider: "smtp",
        providerMessageId: result.messageId ?? null,
        status: "sent",
        sentAt: new Date(),
        metadata: isDev ? { actionUrl } : undefined,
      },
    });

    emailLogger.info("Auth pipeline: SMTP send succeeded", {
      emailType,
      to,
      messageId: result.messageId,
      smtpHost: env.SMTP_HOST,
      durationMs: Date.now() - smtpStartMs,
    });
  } catch (error) {
    await db.emailEvent.create({
      data: {
        userId: userId ?? null,
        emailType,
        recipientEmail: to,
        provider: "smtp",
        status: "failed",
        metadata: {
          error: error instanceof Error ? error.message : "unknown",
          ...(isDev ? { actionUrl } : {}),
        },
      },
    });

    emailLogger.error("Auth pipeline: SMTP send failed", {
      emailType,
      to,
      smtpHost: env.SMTP_HOST,
      durationMs: Date.now() - smtpStartMs,
      error: error instanceof Error ? { name: error.name, message: error.message } : error,
    });

    if (env.EMAIL_OTP_DEV_FALLBACK && isDev) {
      emailLogger.warn(
        "SMTP failed; dev fallback enabled — use actionUrl from logs or verify page",
        {
          emailType,
          to,
          actionUrl,
        },
      );
      return;
    }

    throw error;
  }
}

export async function sendMagicLinkEmail({
  email,
  url,
  userId,
}: {
  email: string;
  url: string;
  userId?: string;
}): Promise<void> {
  await sendAuthEmail({
    to: email,
    subject: "Sign in to Instabot",
    actionUrl: url,
    text: `Welcome to Instabot!\n\nClick this link to verify your email and sign in: ${url}\n\nThis link expires in 24 hours.`,
    html: `
      <p>Welcome to Instabot!</p>
      <p><a href="${url}">Click here to verify your email and continue</a>.</p>
      <p>This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
    `,
    emailType: "magic_link",
    userId,
  });
}

export async function sendPasswordResetEmail({
  email,
  url,
  userId,
}: {
  email: string;
  url: string;
  userId?: string;
}): Promise<void> {
  await sendAuthEmail({
    to: email,
    subject: "Reset your Instabot password",
    actionUrl: url,
    text: `Reset your password: ${url}`,
    html: `
      <p>You requested a password reset.</p>
      <p><a href="${url}">Click here to reset your password</a>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
    emailType: "password_reset",
    userId,
  });
}
