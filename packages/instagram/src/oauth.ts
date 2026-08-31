import { randomBytes } from "node:crypto";

import { db } from "@repo/db";

import { buildInstagramAuthUrl } from "./config";
import { InstagramError } from "./errors";

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

export async function createOAuthState({
  workspaceId,
  userId,
  provider = "instagram",
}: {
  workspaceId: string;
  userId: string;
  provider?: string;
}): Promise<{ state: string; authUrl: string }> {
  const state = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + OAUTH_STATE_TTL_MS);

  await db.oAuthState.create({
    data: {
      state,
      workspaceId,
      userId,
      provider,
      expiresAt,
    },
  });

  return {
    state,
    authUrl: buildInstagramAuthUrl(state),
  };
}

export async function validateOAuthState(state: string): Promise<{
  workspaceId: string;
  userId: string;
  provider: string;
}> {
  const record = await db.oAuthState.findUnique({
    where: { state },
  });

  if (!record) {
    throw new InstagramError("invalid_state", "Invalid or expired connection request.");
  }

  if (record.expiresAt < new Date()) {
    await db.oAuthState.delete({ where: { id: record.id } });
    throw new InstagramError("expired_state", "Connection request expired. Please try again.");
  }

  await db.oAuthState.delete({ where: { id: record.id } });

  return {
    workspaceId: record.workspaceId,
    userId: record.userId,
    provider: record.provider,
  };
}
