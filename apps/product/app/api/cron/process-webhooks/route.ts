import { NextResponse } from "next/server";

import { processPendingWebhookEvents } from "@repo/instagram";

import { withApiHandler } from "@/lib/api/handler";
import { env } from "@/lib/env";

export const GET = withApiHandler("cron:process-webhooks", async (request) => {
  const authHeader = request.headers.get("authorization");
  const cronSecret = env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Unauthorized" } },
      { status: 401 },
    );
  }

  const processed = await processPendingWebhookEvents(100);
  return NextResponse.json({ processed });
});
