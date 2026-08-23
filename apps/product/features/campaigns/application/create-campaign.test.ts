import { describe, expect, it } from "vitest";

import { makeCreateCampaign } from "@/features/campaigns/application/create-campaign";
import { CampaignValidationError } from "@/features/campaigns/domain/errors";
import { createInMemoryCampaignRepository } from "@/features/campaigns/infrastructure/in-memory-campaign-repository";

describe("createCampaign use case", () => {
  it("persists a valid campaign via the repository port", async () => {
    const repo = createInMemoryCampaignRepository();
    const createCampaign = makeCreateCampaign(repo);

    const campaign = await createCampaign({ name: "New launch", channel: "email" });

    expect(campaign.id).toBeDefined();
    expect(campaign.status).toBe("draft");
    expect(await repo.list()).toHaveLength(1);
  });

  it("rejects invalid names before touching infrastructure", async () => {
    const repo = createInMemoryCampaignRepository();
    const createCampaign = makeCreateCampaign(repo);

    await expect(createCampaign({ name: "x", channel: "sms" })).rejects.toBeInstanceOf(
      CampaignValidationError,
    );
    expect(await repo.list()).toHaveLength(0);
  });
});
