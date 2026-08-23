import { NextResponse } from "next/server";

import { CampaignValidationError } from "@/features/campaigns/domain/errors";
import { getCampaignService } from "@/features/campaigns/infrastructure/campaign-module";
import { createCampaignSchema } from "@/features/campaigns/presentation/schemas";
import { withApiHandler } from "@/lib/api/handler";
import { UnprocessableEntityError } from "@/lib/errors";

/**
 * Framework-specific HTTP boundary. It only handles transport concerns
 * (parsing, status codes) and delegates all business logic to use cases.
 * Error handling, logging and error->response mapping are centralized in
 * `withApiHandler`.
 */
export const GET = withApiHandler("campaigns", async () => {
  const { listCampaigns } = getCampaignService();
  const campaigns = await listCampaigns();
  return NextResponse.json(campaigns);
});

export const POST = withApiHandler("campaigns", async (request) => {
  const body: unknown = await request.json().catch(() => null);
  // `parse` throws a ZodError, which the handler maps to a 400.
  const input = createCampaignSchema.parse(body);

  try {
    const { createCampaign } = getCampaignService();
    const campaign = await createCampaign(input);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    // Translate a domain error into an application/transport error at the boundary.
    if (error instanceof CampaignValidationError) {
      throw new UnprocessableEntityError(error.message);
    }
    throw error;
  }
});
