import { NextResponse } from "next/server";

import { getWorkspaceService } from "@/features/workspace/infrastructure/workspace-module";
import { mapWorkspaceDomainError } from "@/features/workspace/presentation/map-domain-error";
import { createWorkspaceSchema } from "@/features/workspace/presentation/schemas";
import { withApiHandler } from "@/lib/api/handler";
import { requireSession } from "@/lib/auth";

export const POST = withApiHandler("workspaces:create", async (request) => {
  const session = await requireSession();
  const body = createWorkspaceSchema.parse(await request.json());

  try {
    const { createWorkspace } = getWorkspaceService();
    const { workspace } = await createWorkspace({
      userId: session.user.id,
      name: body.name,
      timezone: body.timezone,
    });

    return NextResponse.json({ workspace });
  } catch (error) {
    throw mapWorkspaceDomainError(error);
  }
});

export const GET = withApiHandler("workspaces:current", async () => {
  const session = await requireSession();
  const { getActiveWorkspace } = getWorkspaceService();
  const workspace = await getActiveWorkspace(session.user.id);

  return NextResponse.json({ workspace });
});
