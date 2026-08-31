import { db } from "@repo/db";
import { logger } from "@repo/logger";

import { WEBHOOK_EVENT_STATUS } from "./constants";
import { getInstagramEnv } from "./env";
import { extractEventType, extractExternalEventId } from "./webhook-parser";

const webhookLogger = logger.child("instagram:webhook");

export interface WebhookQueuePort {
  enqueue(eventId: string): Promise<void>;
  processPending(limit?: number): Promise<number>;
}

export function verifyWebhookSubscription({
  mode,
  token,
  challenge,
}: {
  mode?: string;
  token?: string;
  challenge?: string;
}): string | null {
  const env = getInstagramEnv();

  if (mode === "subscribe" && token === env.META_WEBHOOK_VERIFY_TOKEN) {
    return challenge ?? null;
  }

  return null;
}

export async function persistWebhookEvent(payload: unknown): Promise<{
  eventId: string;
  isNew: boolean;
}> {
  const externalEventId = extractExternalEventId(payload);
  const eventType = extractEventType(payload);

  const existing = await db.instagramWebhookEvent.findUnique({
    where: { externalEventId },
  });

  if (existing) {
    webhookLogger.info("Duplicate webhook event skipped", { externalEventId });
    return { eventId: existing.id, isNew: false };
  }

  const event = await db.instagramWebhookEvent.create({
    data: {
      externalEventId,
      eventType,
      payload: payload as object,
      status: WEBHOOK_EVENT_STATUS.PENDING,
    },
  });

  webhookLogger.info("Webhook event persisted", { eventId: event.id, externalEventId, eventType });
  return { eventId: event.id, isNew: true };
}

export async function processWebhookEvent(eventId: string): Promise<void> {
  const event = await db.instagramWebhookEvent.findUnique({ where: { id: eventId } });
  if (!event) return;

  if (event.status === WEBHOOK_EVENT_STATUS.COMPLETED) return;

  await db.instagramWebhookEvent.update({
    where: { id: eventId },
    data: { status: WEBHOOK_EVENT_STATUS.PROCESSING },
  });

  try {
    webhookLogger.info("Processing webhook event", {
      eventId,
      externalEventId: event.externalEventId,
      eventType: event.eventType,
    });

    await db.instagramWebhookEvent.update({
      where: { id: eventId },
      data: {
        status: WEBHOOK_EVENT_STATUS.COMPLETED,
        processedAt: new Date(),
        errorMessage: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Processing failed";
    await db.instagramWebhookEvent.update({
      where: { id: eventId },
      data: {
        status: WEBHOOK_EVENT_STATUS.FAILED,
        errorMessage: message,
        retryCount: { increment: 1 },
      },
    });

    webhookLogger.error("Webhook event processing failed", {
      eventId,
      error: error instanceof Error ? { name: error.name, message: error.message } : error,
    });
    throw error;
  }
}

export async function processPendingWebhookEvents(limit = 50): Promise<number> {
  const events = await db.instagramWebhookEvent.findMany({
    where: {
      status: { in: [WEBHOOK_EVENT_STATUS.PENDING, WEBHOOK_EVENT_STATUS.FAILED] },
      retryCount: { lt: 5 },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let processed = 0;
  for (const event of events) {
    try {
      await processWebhookEvent(event.id);
      processed += 1;
    } catch {
      // already logged
    }
  }

  return processed;
}

export const postgresWebhookQueue: WebhookQueuePort = {
  async enqueue(eventId: string) {
    await processWebhookEvent(eventId);
  },
  async processPending(limit?: number) {
    return processPendingWebhookEvents(limit);
  },
};
