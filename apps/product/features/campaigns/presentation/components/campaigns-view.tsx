"use client";

import { PageHeader } from "@/components/page-header";
import { CampaignTable } from "@/features/campaigns/presentation/components/campaign-table";
import { CreateCampaignDialog } from "@/features/campaigns/presentation/components/create-campaign-dialog";
import { useCampaigns } from "@/features/campaigns/presentation/hooks/use-campaigns";

export function CampaignsView() {
  const { data, isLoading, isError } = useCampaigns();

  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Create and monitor your review request campaigns."
        actions={<CreateCampaignDialog />}
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading campaigns...</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load campaigns.</p>
      ) : (
        <CampaignTable data={data ?? []} />
      )}
    </div>
  );
}
