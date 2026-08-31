export type InstagramErrorCode =
  | "oauth_denied"
  | "invalid_state"
  | "expired_state"
  | "token_exchange_failed"
  | "account_lookup_failed"
  | "unsupported_account"
  | "missing_permissions"
  | "already_connected"
  | "account_connected_elsewhere"
  | "api_error"
  | "unknown";

export class InstagramError extends Error {
  readonly code: InstagramErrorCode;
  readonly safeMessage: string;
  readonly statusCode: number;

  constructor(code: InstagramErrorCode, safeMessage: string, statusCode = 400) {
    super(safeMessage);
    this.name = "InstagramError";
    this.code = code;
    this.safeMessage = safeMessage;
    this.statusCode = statusCode;
  }
}

export function mapMetaApiError(error: unknown): InstagramError {
  if (error instanceof InstagramError) return error;

  const message = error instanceof Error ? error.message : "Unknown error";

  if (message.includes("access_denied") || message.includes("OAuthException")) {
    return new InstagramError(
      "oauth_denied",
      "Instagram authorization was denied. Please try again and grant the required permissions.",
    );
  }

  return new InstagramError(
    "api_error",
    "We could not complete the Instagram connection. Please try again.",
    500,
  );
}

export function getInstagramErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    oauth_denied: "Instagram authorization was denied.",
    invalid_state: "The connection request expired or was invalid. Please try again.",
    expired_state: "The connection request expired. Please try again.",
    token_exchange_failed: "We could not verify your Instagram account. Please try again.",
    account_lookup_failed: "We could not retrieve your Instagram account details.",
    unsupported_account:
      "Only Instagram Professional (Business or Creator) accounts are supported.",
    missing_permissions: "Required Instagram permissions were not granted.",
    already_connected: "This Instagram account is already connected.",
    account_connected_elsewhere: "This Instagram account is connected to another workspace.",
    api_error: "An error occurred while connecting Instagram. Please try again.",
    unknown: "Something went wrong. Please try again.",
  };
  return messages[code] ?? messages.unknown ?? "Something went wrong. Please try again.";
}
