import type { Campaign, NewCampaign } from "@/features/campaigns/domain/campaign";

/**
 * Port (interface) that the application layer depends on. Infrastructure
 * provides adapters (in-memory now, Postgres/Prisma later) without the domain
 * or application layers knowing which implementation is used.
 */
export interface CampaignRepository {
  list(): Promise<Campaign[]>;
  create(input: NewCampaign): Promise<Campaign>;
}
