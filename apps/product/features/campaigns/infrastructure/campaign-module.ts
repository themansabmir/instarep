import { makeCreateCampaign } from "@/features/campaigns/application/create-campaign";
import { makeListCampaigns } from "@/features/campaigns/application/list-campaigns";
import type { CampaignRepository } from "@/features/campaigns/domain/ports";
import {
  createInMemoryCampaignRepository,
  seedCampaigns,
} from "@/features/campaigns/infrastructure/in-memory-campaign-repository";

/**
 * Composition root for the campaigns feature. This is the single place that
 * wires concrete adapters to use cases. Replacing the persistence layer later
 * only touches this file.
 */
let repository: CampaignRepository | undefined;

function getRepository(): CampaignRepository {
  repository ??= createInMemoryCampaignRepository(seedCampaigns);
  return repository;
}

export function getCampaignService() {
  const repo = getRepository();
  return {
    listCampaigns: makeListCampaigns(repo),
    createCampaign: makeCreateCampaign(repo),
  };
}
