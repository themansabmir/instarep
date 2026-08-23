import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { responseRate } from "@/features/campaigns/domain/campaign";
import { getCampaignService } from "@/features/campaigns/infrastructure/campaign-module";
import { StatCards, type Stat } from "@/features/dashboard/components/stat-cards";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Server Component: data is fetched on the server via the application layer,
 * so no client-side data library is needed here.
 */
export default async function DashboardPage() {
  const { listCampaigns } = getCampaignService();
  const campaigns = await listCampaigns();

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalResponses = campaigns.reduce((sum, c) => sum + c.responses, 0);
  const activeCount = campaigns.filter((c) => c.status === "active").length;
  const rate = responseRate({ sent: totalSent, responses: totalResponses });

  const stats: Stat[] = [
    { label: "Active campaigns", value: activeCount.toString() },
    { label: "Messages sent", value: totalSent.toLocaleString() },
    { label: "Responses", value: totalResponses.toLocaleString() },
    { label: "Response rate", value: `${Math.round(rate * 100)}%` },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="An overview of your review performance." />
      <StatCards stats={stats} />
    </div>
  );
}
