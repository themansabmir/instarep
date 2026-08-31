import { db } from "@repo/db";

export async function getDevVerificationLink(email?: string): Promise<string | null> {
  if (process.env.NODE_ENV !== "development") return null;

  const event = await db.emailEvent.findFirst({
    where: {
      emailType: { in: ["magic_link", "verification"] },
      status: "sent",
      ...(email ? { recipientEmail: email.toLowerCase() } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { metadata: true },
  });

  if (!event?.metadata || typeof event.metadata !== "object") return null;

  const actionUrl = (event.metadata as { actionUrl?: string }).actionUrl;
  return actionUrl ?? null;
}
