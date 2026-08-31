/**
 * Domain layer — view models and types for Instagram connection in the product app.
 */

export interface InstagramAccount {
  id: string;
  instagramUserId: string;
  username: string | null;
  displayName: string | null;
  profilePictureUrl: string | null;
  biography: string | null;
  followersCount: number | null;
  followingCount: number | null;
  mediaCount: number | null;
  status: string;
  connectedAt: Date | null;
  disconnectedAt: Date | null;
  tokenExpiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InstagramAccountView {
  id: string;
  username: string | null;
  displayName: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  status: string;
  connectedAt: string | null;
}

export interface ConnectInstagramInput {
  code?: string;
  state?: string;
  error?: string;
  errorReason?: string;
}

export interface ConnectInstagramResult {
  accountId: string;
  username: string | null;
  displayName: string | null;
  status: string;
}

export function toInstagramAccountView(account: InstagramAccount): InstagramAccountView {
  return {
    id: account.id,
    username: account.username,
    displayName: account.displayName,
    profilePictureUrl: account.profilePictureUrl,
    followersCount: account.followersCount,
    status: account.status,
    connectedAt: account.connectedAt?.toISOString() ?? null,
  };
}
