import { redirect } from "next/navigation";

import { CreateWorkspaceForm } from "@/features/workspace/presentation/components/create-workspace-form";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { getSession } from "@/lib/auth";
import { userHasPassword } from "@/lib/user-credentials";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  if (!(await userHasPassword(session.user.id))) {
    redirect("/onboarding/set-password");
  }

  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);
  if (workspace) redirect("/onboarding/instagram");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome to Instabot</h1>
        <p className="text-muted-foreground text-sm">Let&apos;s set up your workspace first.</p>
      </div>
      <CreateWorkspaceForm />
    </div>
  );
}
