import { NextResponse } from "next/server";

import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { withApiHandler } from "@/lib/api/handler";
import { requireSession } from "@/lib/auth";
import { NotFoundError } from "@/lib/errors";

export const GET = withApiHandler("instagram:connect", async () => {
  const session = await requireSession();
  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);

  if (!workspace) {
    throw new NotFoundError("Workspace not found.");
  }

  const { getConnectUrl } = getInstagramService();
  const authUrl = await getConnectUrl(workspace.id, session.user.id);

  return NextResponse.redirect(authUrl);
});
