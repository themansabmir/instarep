import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/verify-email?pending=1");
  }

  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);
  if (!workspace) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader user={session.user} workspaceName={workspace.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
