export const INSTAGRAM_ACCOUNT_STATUS = {
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  TOKEN_EXPIRING: "TOKEN_EXPIRING",
  DISCONNECTED: "DISCONNECTED",
  ERROR: "ERROR",
} as const;

export type InstagramAccountStatus =
  (typeof INSTAGRAM_ACCOUNT_STATUS)[keyof typeof INSTAGRAM_ACCOUNT_STATUS];

export const WEBHOOK_EVENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type WebhookEventStatus = (typeof WEBHOOK_EVENT_STATUS)[keyof typeof WEBHOOK_EVENT_STATUS];

export function isAccountOperational(status: string): boolean {
  return status === INSTAGRAM_ACCOUNT_STATUS.CONNECTED;
}
