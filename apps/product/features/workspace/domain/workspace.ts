/**
 * Domain layer — pure business types and rules. No framework or infrastructure imports.
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  ownerUserId: string;
}

export interface ActiveWorkspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  role: string;
}

export interface WorkspaceMembership {
  workspaceId: string;
  userId: string;
  role: string;
  workspace: Workspace;
}

export interface CreateWorkspaceInput {
  userId: string;
  name: string;
  timezone?: string;
}

export interface UpdateWorkspaceSettingsInput {
  workspaceId: string;
  userId: string;
  name?: string;
  timezone?: string;
}

export const WORKSPACE_NAME_MIN_LENGTH = 2;
export const WORKSPACE_NAME_MAX_LENGTH = 150;

export function isWorkspaceNameValid(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= WORKSPACE_NAME_MIN_LENGTH && trimmed.length <= WORKSPACE_NAME_MAX_LENGTH;
}

export function slugifyWorkspaceName(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);

  return slug.length > 0 ? slug : "workspace";
}
