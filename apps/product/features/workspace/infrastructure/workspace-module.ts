import {
  makeAssertWorkspaceAccess,
  makeCreateWorkspace,
  makeGetActiveWorkspace,
  makeGetWorkspaceForUser,
  makeRequireWorkspaceMember,
  makeUpdateWorkspaceSettings,
} from "@/features/workspace/application/workspace-use-cases";
import type { WorkspaceRepository } from "@/features/workspace/domain/ports";
import { createPrismaWorkspaceRepository } from "@/features/workspace/infrastructure/prisma-workspace-repository";

/**
 * Composition root for the workspace feature. This is the single place that
 * wires concrete adapters to use cases.
 */
let repository: WorkspaceRepository | undefined;

function getRepository(): WorkspaceRepository {
  repository ??= createPrismaWorkspaceRepository();
  return repository;
}

export function getWorkspaceService() {
  const repo = getRepository();
  return {
    getActiveWorkspace: makeGetActiveWorkspace(repo),
    requireWorkspaceMember: makeRequireWorkspaceMember(repo),
    assertWorkspaceAccess: makeAssertWorkspaceAccess(repo),
    createWorkspace: makeCreateWorkspace(repo),
    updateWorkspaceSettings: makeUpdateWorkspaceSettings(repo),
    getWorkspaceForUser: makeGetWorkspaceForUser(repo),
  };
}
