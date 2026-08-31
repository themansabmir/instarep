import { redirect } from "next/navigation";

import { toInstagramAccountView } from "@/features/instagram/domain/instagram-account";
import { InstagramConnectionsView } from "@/features/instagram/presentation/components/instagram-connection";
import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { getSession } from "@/lib/auth";

export default async function OnboardingInstagramPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);
  if (!workspace) redirect("/onboarding");

  const { listAccounts } = getInstagramService();
  const accounts = await listAccounts(workspace.id);
  const hasConnected = accounts.some((account) => account.status === "CONNECTED");

  if (hasConnected) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Connect Instagram</h1>
        <p className="text-muted-foreground text-sm">
          Authorize Instabot to access your Instagram Professional account. We never ask for your
          Instagram password.
        </p>
      </div>
      <InstagramConnectionsView accounts={accounts.map(toInstagramAccountView)} />
    </div>
  );
}
