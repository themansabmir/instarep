import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(packageDir, "../../../apps/product/.env") });

const { sendMagicLinkEmail } = await import("../src/email.ts");

const testEmail = process.argv[2] ?? process.env.SMTP_USER;

await sendMagicLinkEmail({
  email: testEmail,
  url: "http://localhost:3001/api/auth/magic-link/verify?token=test-link",
});

console.log(`Magic link email send attempted for ${testEmail}`);
