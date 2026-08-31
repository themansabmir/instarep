import { NextResponse } from "next/server";

import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { disconnectInstagramSchema } from "@/features/instagram/presentation/schemas";
import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { withApiHandler } from "@/lib/api/handler";
import { requireSession } from "@/lib/auth";
import { NotFoundError } from "@/lib/errors";

export const POST = withApiHandler("instagram:disconnect", async (request) => {
  const session = await requireSession();
  const { getActiveWorkspace, requireWorkspaceMember } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);

  if (!workspace) {
    throw new NotFoundError("Workspace not found.");
  }

  const body = disconnectInstagramSchema.parse(await request.json());
  await requireWorkspaceMember(workspace.id, session.user.id);

  const { disconnectAccount } = getInstagramService();
  await disconnectAccount(workspace.id, body.accountId);

  return NextResponse.json({ success: true });
});
