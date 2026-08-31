import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(packageDir, "../../../apps/product/.env") });

if (process.platform === "win32" && process.arch === "arm64") {
  process.env.PRISMA_CLIENT_ENGINE_TYPE ??= "binary";
}
