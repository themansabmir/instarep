import type {
  ActiveWorkspace,
  CreateWorkspaceInput,
  Workspace,
  WorkspaceMembership,
} from "@/features/workspace/domain/workspace";

/**
 * Port that the application layer depends on. Infrastructure provides adapters
 * (Prisma now) without the domain knowing which implementation is used.
 */
export interface WorkspaceRepository {
  findActiveForUser(userId: string): Promise<ActiveWorkspace | null>;
  findMembership(workspaceId: string, userId: string): Promise<WorkspaceMembership | null>;
  create(input: CreateWorkspaceInput): Promise<Workspace>;
  updateSettings(
    workspaceId: string,
    data: { name?: string; timezone?: string },
  ): Promise<Workspace>;
}
