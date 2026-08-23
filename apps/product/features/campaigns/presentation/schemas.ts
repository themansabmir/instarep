import { z } from "zod";

import { CAMPAIGN_NAME_MIN_LENGTH } from "@/features/campaigns/domain/campaign";

export const createCampaignSchema = z.object({
  name: z
    .string()
    .min(CAMPAIGN_NAME_MIN_LENGTH, {
      message: `Name must be at least ${CAMPAIGN_NAME_MIN_LENGTH} characters.`,
    })
    .max(80),
  channel: z.enum(["email", "sms"]),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
