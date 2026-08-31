import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const packageDir = dirname(fileURLToPath(import.meta.url));
const productEnvPath = resolve(packageDir, "../../../apps/product/.env");

config({ path: productEnvPath });

// Windows on ARM64 cannot load Prisma's x64 Node-API engine in-process.
if (process.platform === "win32" && process.arch === "arm64") {
  process.env.PRISMA_CLI_QUERY_ENGINE_TYPE ??= "binary";
  process.env.PRISMA_CLIENT_ENGINE_TYPE ??= "binary";
}

const args = process.argv.slice(2);
const needsDatabaseUrl = args.length > 0 && args[0] !== "generate";

if (needsDatabaseUrl && !process.env.DATABASE_URL) {
  console.error(
    `DATABASE_URL not found. Set it in apps/product/.env (looked at ${productEnvPath}).`,
  );
  process.exit(1);
}

const result = spawnSync("prisma", args, {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
