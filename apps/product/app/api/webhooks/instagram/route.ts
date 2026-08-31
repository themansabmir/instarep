import { after } from "next/server";
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";

import {
  persistWebhookEvent,
  postgresWebhookQueue,
  verifyWebhookSubscription,
} from "@repo/instagram";

import { withApiHandler } from "@/lib/api/handler";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const verified = verifyWebhookSubscription({
    mode: mode ?? undefined,
    token: token ?? undefined,
    challenge: challenge ?? undefined,
  });

  if (!verified) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(verified, { status: 200 });
}

export const POST = withApiHandler("webhooks:instagram", async (request) => {
  const payload = await request.json();
  const { eventId, isNew } = await persistWebhookEvent(payload);

  if (isNew) {
    after(() => {
      waitUntil(postgresWebhookQueue.enqueue(eventId));
    });
  }

  return NextResponse.json({ received: true });
});
