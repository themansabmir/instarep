import { NextResponse } from "next/server";

import { toInstagramAccountView } from "@/features/instagram/domain/instagram-account";
import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { withApiHandler } from "@/lib/api/handler";
import { requireSession } from "@/lib/auth";

export const GET = withApiHandler("instagram:accounts", async () => {
  const session = await requireSession();
  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);

  if (!workspace) {
    return NextResponse.json({ accounts: [] });
  }

  const { listAccounts } = getInstagramService();
  const accounts = await listAccounts(workspace.id);

  return NextResponse.json({
    accounts: accounts.map(toInstagramAccountView),
  });
});
