import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { WorkspaceSettingsForm } from "@/features/workspace/presentation/components/workspace-settings-form";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);
  if (!workspace) redirect("/onboarding");

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" description="Manage your workspace and account." />
      <WorkspaceSettingsForm workspace={workspace} />
    </div>
  );
}
