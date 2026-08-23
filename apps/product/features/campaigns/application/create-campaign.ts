import {
  isCampaignNameValid,
  type Campaign,
  type NewCampaign,
} from "@/features/campaigns/domain/campaign";
import { CampaignValidationError } from "@/features/campaigns/domain/errors";
import type { CampaignRepository } from "@/features/campaigns/domain/ports";

/**
 * Use case: create a campaign. Enforces the domain invariant before delegating
 * persistence to the repository port.
 */
export function makeCreateCampaign(repository: CampaignRepository) {
  return async function createCampaign(input: NewCampaign): Promise<Campaign> {
    if (!isCampaignNameValid(input.name)) {
      throw new CampaignValidationError("Campaign name is too short.");
    }

    return repository.create({
      name: input.name.trim(),
      channel: input.channel,
    });
  };
}
