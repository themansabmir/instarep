/**
 * Domain layer — pure business types and rules. This module must not import
 * React, Next.js, database drivers, or any other infrastructure concern.
 */

export type CampaignChannel = "email" | "sms";

export type CampaignStatus = "draft" | "active" | "paused" | "completed";

export interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  sent: number;
  responses: number;
  createdAt: string;
}

export interface NewCampaign {
  name: string;
  channel: CampaignChannel;
}

/** Minimum length enforced by the domain, independent of any UI validation. */
export const CAMPAIGN_NAME_MIN_LENGTH = 2;

/** Response rate as a fraction in the range [0, 1]. */
export function responseRate(campaign: Pick<Campaign, "sent" | "responses">): number {
  if (campaign.sent <= 0) {
    return 0;
  }
  return campaign.responses / campaign.sent;
}

export function isCampaignNameValid(name: string): boolean {
  return name.trim().length >= CAMPAIGN_NAME_MIN_LENGTH;
}
