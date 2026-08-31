import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(packageDir, "../../../apps/product/.env") });

const { db } = await import("../src/index.ts");

const orphans = await db.user.findMany({
  where: {
    emailVerified: false,
    accounts: { none: {} },
  },
  select: { id: true, email: true },
});

for (const user of orphans) {
  await db.user.delete({ where: { id: user.id } });
  console.log(`Deleted orphaned user: ${user.email}`);
}

if (orphans.length === 0) {
  console.log("No orphaned users found.");
}

await db.$disconnect();
