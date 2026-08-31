import type { InstagramAccountView } from "@/features/instagram/domain/instagram-account";
import type { DisconnectInstagramInput } from "@/features/instagram/presentation/schemas";

interface AccountsResponse {
  accounts: InstagramAccountView[];
}

export async function disconnectInstagramAccount(input: DisconnectInstagramInput): Promise<void> {
  const res = await fetch("/api/instagram/disconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to disconnect Instagram account");
  }
}

export async function fetchInstagramAccounts(): Promise<InstagramAccountView[]> {
  const res = await fetch("/api/instagram/accounts", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load Instagram accounts");
  }
  const body = (await res.json()) as AccountsResponse;
  return body.accounts;
}

export const instagramKeys = {
  all: ["instagram"] as const,
  accounts: ["instagram", "accounts"] as const,
};
