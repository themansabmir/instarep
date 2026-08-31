import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/page-header";
import { toInstagramAccountView } from "@/features/instagram/domain/instagram-account";
import { InstagramConnectionsView } from "@/features/instagram/presentation/components/instagram-connection";
import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Instagram" };

export default async function InstagramSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);
  if (!workspace) redirect("/onboarding");

  const { listAccounts } = getInstagramService();
  const accounts = await listAccounts(workspace.id);

  return (
    <div>
      <PageHeader
        title="Instagram"
        description="Connect and manage your Instagram Professional account."
      />
      <InstagramConnectionsView accounts={accounts.map(toInstagramAccountView)} />
    </div>
  );
}
