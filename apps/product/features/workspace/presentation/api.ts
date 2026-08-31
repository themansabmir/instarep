import type { ActiveWorkspace } from "@/features/workspace/domain/workspace";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceSettingsInput,
} from "@/features/workspace/presentation/schemas";

interface WorkspaceResponse {
  workspace: ActiveWorkspace | null;
}

interface CreateWorkspaceResponse {
  workspace: ActiveWorkspace;
}

export async function fetchCurrentWorkspace(): Promise<ActiveWorkspace | null> {
  const res = await fetch("/api/workspaces", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load workspace");
  }
  const body = (await res.json()) as WorkspaceResponse;
  return body.workspace;
}

export async function createWorkspace(input: CreateWorkspaceInput): Promise<ActiveWorkspace> {
  const res = await fetch("/api/workspaces", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to create workspace");
  }
  const body = (await res.json()) as CreateWorkspaceResponse;
  return body.workspace;
}

export async function updateWorkspaceSettings(
  input: UpdateWorkspaceSettingsInput,
): Promise<ActiveWorkspace> {
  const res = await fetch("/api/workspaces/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error("Failed to update workspace");
  }
  const body = (await res.json()) as { workspace: ActiveWorkspace };
  return body.workspace;
}

export const workspaceKeys = {
  all: ["workspaces"] as const,
  current: ["workspaces", "current"] as const,
};
