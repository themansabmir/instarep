import { NextResponse } from "next/server";

import { CampaignValidationError } from "@/features/campaigns/domain/errors";
import { getCampaignService } from "@/features/campaigns/infrastructure/campaign-module";
import { createCampaignSchema } from "@/features/campaigns/presentation/schemas";

/**
 * Framework-specific HTTP boundary. It only handles transport concerns
 * (parsing, status codes) and delegates all business logic to use cases.
 */
export async function GET() {
  const { listCampaigns } = getCampaignService();
  const campaigns = await listCampaigns();
  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createCampaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { createCampaign } = getCampaignService();
    const campaign = await createCampaign(parsed.data);
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    if (error instanceof CampaignValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
