import { db } from "../src";

/**
 * Idempotent seed for local development. Run with `pnpm --filter @repo/db db:seed`.
 * Extend this as the product grows; keep it safe to run repeatedly.
 */
async function main() {
  const plans = [
    {
      name: "Free",
      slug: "free",
      price: "0",
      currency: "USD",
      billingInterval: "month",
      includedCredits: 1_000n,
      maxInstagramAccounts: 1,
      maxKnowledgeBases: 1,
      maxConversations: 100,
    },
    {
      name: "Growth",
      slug: "growth",
      price: "49",
      currency: "USD",
      billingInterval: "month",
      includedCredits: 50_000n,
      maxInstagramAccounts: 5,
      maxKnowledgeBases: 10,
      maxConversations: 10_000,
    },
  ];

  for (const plan of plans) {
    await db.subscriptionPlan.upsert({
      where: { slug: plan.slug },
      update: plan,
      create: plan,
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
