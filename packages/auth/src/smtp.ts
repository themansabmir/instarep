import nodemailer from "nodemailer";

import { getAuthEnv } from "./env";

let transporter: nodemailer.Transporter | undefined;

export function getSmtpTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const env = getAuthEnv();

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return transporter;
}

export function getEmailFrom(): string {
  const env = getAuthEnv();
  return env.EMAIL_FROM ?? env.SMTP_USER;
}
