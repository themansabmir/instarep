import { db } from "@repo/db";
import { logger } from "@repo/logger";

import {
  fetchInstagramProfile,
  getInstagramUserId,
  validateProfessionalAccount,
} from "./account-client";
import { INSTAGRAM_ACCOUNT_STATUS } from "./constants";
import { InstagramError } from "./errors";
import { validateOAuthState } from "./oauth";
import { encryptToken } from "./token-crypto";
import { exchangeCodeForShortLivedToken, exchangeForLongLivedToken } from "./token-exchange";

const connectLogger = logger.child("instagram:connect");

export interface ConnectInstagramResult {
  accountId: string;
  username: string | null;
  displayName: string | null;
  status: string;
}

export async function connectInstagramAccount({
  code,
  state,
  error,
  errorReason,
}: {
  code?: string;
  state?: string;
  error?: string;
  errorReason?: string;
}): Promise<ConnectInstagramResult> {
  if (error || errorReason) {
    throw new InstagramError(
      "oauth_denied",
      "Instagram authorization was denied. Please try again and grant the required permissions.",
    );
  }

  if (!code || !state) {
    throw new InstagramError("invalid_state", "Invalid connection request.");
  }

  const { workspaceId } = await validateOAuthState(state);

  const shortLived = await exchangeCodeForShortLivedToken(code);
  const longLived = await exchangeForLongLivedToken(shortLived.access_token);
  const profile = await fetchInstagramProfile(longLived.access_token);
  validateProfessionalAccount(profile);

  const instagramUserId = getInstagramUserId(profile);
  const tokenExpiresAt = longLived.expires_in
    ? new Date(Date.now() + longLived.expires_in * 1000)
    : null;

  const existingElsewhere = await db.instagramAccount.findFirst({
    where: {
      instagramUserId,
      workspaceId: { not: workspaceId },
      status: { not: INSTAGRAM_ACCOUNT_STATUS.DISCONNECTED },
    },
  });

  if (existingElsewhere) {
    throw new InstagramError(
      "account_connected_elsewhere",
      "This Instagram account is already connected to another workspace.",
      409,
    );
  }

  const encryptedToken = encryptToken(longLived.access_token);

  const account = await db.instagramAccount.upsert({
    where: { instagramUserId },
    create: {
      workspaceId,
      instagramUserId,
      username: profile.username ?? null,
      displayName: profile.name ?? null,
      profilePictureUrl: profile.profile_picture_url ?? null,
      biography: profile.biography ?? null,
      followersCount: profile.followers_count ?? null,
      followingCount: profile.follows_count ?? null,
      mediaCount: profile.media_count ?? null,
      accessTokenEncrypted: encryptedToken,
      tokenExpiresAt,
      status: INSTAGRAM_ACCOUNT_STATUS.CONNECTED,
      connectedAt: new Date(),
      disconnectedAt: null,
    },
    update: {
      workspaceId,
      username: profile.username ?? null,
      displayName: profile.name ?? null,
      profilePictureUrl: profile.profile_picture_url ?? null,
      biography: profile.biography ?? null,
      followersCount: profile.followers_count ?? null,
      followingCount: profile.follows_count ?? null,
      mediaCount: profile.media_count ?? null,
      accessTokenEncrypted: encryptedToken,
      tokenExpiresAt,
      status: INSTAGRAM_ACCOUNT_STATUS.CONNECTED,
      connectedAt: new Date(),
      disconnectedAt: null,
    },
  });

  connectLogger.info("Instagram account connected", {
    workspaceId,
    accountId: account.id,
    instagramUserId,
    username: account.username,
  });

  return {
    accountId: account.id,
    username: account.username,
    displayName: account.displayName,
    status: account.status,
  };
}

export async function disconnectInstagramAccount({
  workspaceId,
  accountId,
}: {
  workspaceId: string;
  accountId: string;
}): Promise<void> {
  const account = await db.instagramAccount.findFirst({
    where: { id: accountId, workspaceId },
  });

  if (!account) {
    throw new InstagramError("account_lookup_failed", "Instagram account not found.", 404);
  }

  await db.instagramAccount.update({
    where: { id: accountId },
    data: {
      status: INSTAGRAM_ACCOUNT_STATUS.DISCONNECTED,
      disconnectedAt: new Date(),
      accessTokenEncrypted: null,
      tokenExpiresAt: null,
    },
  });

  connectLogger.info("Instagram account disconnected", { workspaceId, accountId });
}

export async function listInstagramAccounts(workspaceId: string) {
  const accounts = await db.instagramAccount.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      instagramUserId: true,
      username: true,
      displayName: true,
      profilePictureUrl: true,
      biography: true,
      followersCount: true,
      followingCount: true,
      mediaCount: true,
      status: true,
      connectedAt: true,
      disconnectedAt: true,
      tokenExpiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return accounts;
}
