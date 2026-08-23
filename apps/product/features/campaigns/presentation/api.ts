import type { Campaign } from "@/features/campaigns/domain/campaign";
import type { CreateCampaignInput } from "@/features/campaigns/presentation/schemas";

/**
 * Thin client-side transport for the campaigns HTTP API. This is the boundary
 * where the browser talks to the server; it contains no business logic.
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load campaigns");
  }
  return res.json() as Promise<Campaign[]>;
}

export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  const res = await fetch("/api/campaigns", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to create campaign");
  }
  return res.json() as Promise<Campaign>;
}

export const campaignKeys = {
  all: ["campaigns"] as const,
};
