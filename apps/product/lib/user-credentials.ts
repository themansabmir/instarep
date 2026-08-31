import { db } from "@repo/db";

export async function userHasPassword(userId: string): Promise<boolean> {
  const account = await db.account.findFirst({
    where: { userId, providerId: "credential" },
    select: { password: true },
  });

  return Boolean(account?.password);
}
