import { db } from "@repo/db";

import { slugifyWorkspaceName } from "@/features/workspace/domain/workspace";
import { WorkspaceSlugConflictError } from "@/features/workspace/domain/errors";
import type { WorkspaceRepository } from "@/features/workspace/domain/ports";
import type {
  ActiveWorkspace,
  CreateWorkspaceInput,
  Workspace,
  WorkspaceMembership,
} from "@/features/workspace/domain/workspace";

function mapWorkspace(record: {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  ownerUserId: string;
}): Workspace {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    timezone: record.timezone,
    ownerUserId: record.ownerUserId,
  };
}

export function createPrismaWorkspaceRepository(): WorkspaceRepository {
  return {
    async findActiveForUser(userId: string): Promise<ActiveWorkspace | null> {
      const membership = await db.workspaceMember.findFirst({
        where: { userId, status: "active" },
        orderBy: { createdAt: "asc" },
        include: { workspace: true },
      });

      if (!membership) return null;

      return {
        id: membership.workspace.id,
        name: membership.workspace.name,
        slug: membership.workspace.slug,
        timezone: membership.workspace.timezone,
        role: membership.role,
      };
    },

    async findMembership(workspaceId: string, userId: string): Promise<WorkspaceMembership | null> {
      const membership = await db.workspaceMember.findFirst({
        where: { workspaceId, userId, status: "active" },
        include: { workspace: true },
      });

      if (!membership) return null;

      return {
        workspaceId: membership.workspaceId,
        userId: membership.userId,
        role: membership.role,
        workspace: mapWorkspace(membership.workspace),
      };
    },

    async create(input: CreateWorkspaceInput): Promise<Workspace> {
      const baseSlug = slugifyWorkspaceName(input.name);

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

        try {
          const workspace = await db.$transaction(async (tx) => {
            const created = await tx.workspace.create({
              data: {
                name: input.name,
                slug,
                ownerUserId: input.userId,
                timezone: input.timezone ?? "UTC",
              },
            });

            await tx.workspaceMember.create({
              data: {
                workspaceId: created.id,
                userId: input.userId,
                role: "owner",
                status: "active",
              },
            });

            return created;
          });

          return mapWorkspace(workspace);
        } catch (error) {
          const isUniqueViolation =
            error instanceof Error &&
            "code" in error &&
            (error as { code?: string }).code === "P2002";

          if (!isUniqueViolation || attempt === 4) {
            if (isUniqueViolation) {
              throw new WorkspaceSlugConflictError();
            }
            throw error;
          }
        }
      }

      throw new WorkspaceSlugConflictError();
    },

    async updateSettings(
      workspaceId: string,
      data: { name?: string; timezone?: string },
    ): Promise<Workspace> {
      const workspace = await db.workspace.update({
        where: { id: workspaceId },
        data: {
          ...(data.name ? { name: data.name } : {}),
          ...(data.timezone ? { timezone: data.timezone } : {}),
        },
      });

      return mapWorkspace(workspace);
    },
  };
}
