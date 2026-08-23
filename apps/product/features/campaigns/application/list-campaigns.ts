import type { Campaign } from "@/features/campaigns/domain/campaign";
import type { CampaignRepository } from "@/features/campaigns/domain/ports";

/**
 * Use case: list campaigns. Depends on the repository *port*, not a concrete
 * implementation (dependency inversion).
 */
export function makeListCampaigns(repository: CampaignRepository) {
  return async function listCampaigns(): Promise<Campaign[]> {
    return repository.list();
  };
}
