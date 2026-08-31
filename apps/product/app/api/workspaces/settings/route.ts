import { NextResponse } from "next/server";

import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { mapWorkspaceDomainError } from "@/features/workspace/presentation/map-domain-error";
import { updateWorkspaceSettingsSchema } from "@/features/workspace/presentation/schemas";
import { withApiHandler } from "@/lib/api/handler";
import { requireSession } from "@/lib/auth";
import { NotFoundError } from "@/lib/errors";

export const PATCH = withApiHandler("workspaces:settings", async (request) => {
  const session = await requireSession();
  const { getActiveWorkspace, updateWorkspaceSettings } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);

  if (!workspace) {
    throw new NotFoundError("Workspace not found.");
  }

  const body = updateWorkspaceSettingsSchema.parse(await request.json());

  try {
    const updated = await updateWorkspaceSettings({
      workspaceId: workspace.id,
      userId: session.user.id,
      name: body.name,
      timezone: body.timezone,
    });

    return NextResponse.json({
      workspace: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        timezone: updated.timezone,
        role: workspace.role,
      },
    });
  } catch (error) {
    throw mapWorkspaceDomainError(error);
  }
});
