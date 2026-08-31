import {
  WorkspaceAccessDeniedError,
  WorkspaceNotFoundError,
  WorkspaceValidationError,
} from "@/features/workspace/domain/errors";
import type { WorkspaceRepository } from "@/features/workspace/domain/ports";
import {
  isWorkspaceNameValid,
  type ActiveWorkspace,
  type CreateWorkspaceInput,
  type UpdateWorkspaceSettingsInput,
} from "@/features/workspace/domain/workspace";

export function makeGetActiveWorkspace(repository: WorkspaceRepository) {
  return async function getActiveWorkspace(userId: string): Promise<ActiveWorkspace | null> {
    return repository.findActiveForUser(userId);
  };
}

export function makeRequireWorkspaceMember(repository: WorkspaceRepository) {
  return async function requireWorkspaceMember(workspaceId: string, userId: string) {
    const membership = await repository.findMembership(workspaceId, userId);
    if (!membership) {
      throw new WorkspaceAccessDeniedError();
    }
    return membership;
  };
}

export function makeAssertWorkspaceAccess(repository: WorkspaceRepository) {
  return async function assertWorkspaceAccess(workspaceId: string, userId: string) {
    const membership = await repository.findMembership(workspaceId, userId);
    if (!membership) {
      throw new WorkspaceNotFoundError();
    }
    return membership;
  };
}

export function makeCreateWorkspace(repository: WorkspaceRepository) {
  return async function createWorkspace(input: CreateWorkspaceInput) {
    if (!isWorkspaceNameValid(input.name)) {
      throw new WorkspaceValidationError("Workspace name is too short.");
    }

    const existing = await repository.findActiveForUser(input.userId);
    if (existing) {
      return { workspace: existing, created: false };
    }

    const workspace = await repository.create({
      userId: input.userId,
      name: input.name.trim(),
      timezone: input.timezone ?? "UTC",
    });

    return {
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        timezone: workspace.timezone,
        role: "owner",
      },
      created: true,
    };
  };
}

export function makeUpdateWorkspaceSettings(repository: WorkspaceRepository) {
  const requireMember = makeRequireWorkspaceMember(repository);

  return async function updateWorkspaceSettings(input: UpdateWorkspaceSettingsInput) {
    if (input.name !== undefined && !isWorkspaceNameValid(input.name)) {
      throw new WorkspaceValidationError("Workspace name is too short.");
    }

    await requireMember(input.workspaceId, input.userId);

    const workspace = await repository.updateSettings(input.workspaceId, {
      name: input.name?.trim(),
      timezone: input.timezone,
    });

    return workspace;
  };
}

export function makeGetWorkspaceForUser(repository: WorkspaceRepository) {
  const requireMember = makeRequireWorkspaceMember(repository);

  return async function getWorkspaceForUser(workspaceId: string, userId: string) {
    const membership = await requireMember(workspaceId, userId);
    return membership.workspace;
  };
}
