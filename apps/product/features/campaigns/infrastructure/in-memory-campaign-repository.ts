import type { Campaign, NewCampaign } from "@/features/campaigns/domain/campaign";
import type { CampaignRepository } from "@/features/campaigns/domain/ports";

/**
 * In-memory adapter for the `CampaignRepository` port. Suitable for the MVP and
 * tests. Swapping this for a Postgres/Prisma adapter requires no changes to the
 * domain or application layers.
 */
export function createInMemoryCampaignRepository(seed: Campaign[] = []): CampaignRepository {
  const store: Campaign[] = [...seed];

  return {
    async list() {
      return [...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async create(input: NewCampaign) {
      const campaign: Campaign = {
        id: crypto.randomUUID(),
        name: input.name,
        channel: input.channel,
        status: "draft",
        sent: 0,
        responses: 0,
        createdAt: new Date().toISOString(),
      };
      store.push(campaign);
      return campaign;
    },
  };
}

export const seedCampaigns: Campaign[] = [
  {
    id: "seed-1",
    name: "Post-purchase follow up",
    channel: "email",
    status: "active",
    sent: 1240,
    responses: 372,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Storefront SMS blast",
    channel: "sms",
    status: "paused",
    sent: 640,
    responses: 96,
    createdAt: "2026-08-10T10:00:00.000Z",
  },
];
