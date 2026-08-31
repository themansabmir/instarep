"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createWorkspace,
  fetchCurrentWorkspace,
  updateWorkspaceSettings,
  workspaceKeys,
} from "@/features/workspace/presentation/api";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceSettingsInput,
} from "@/features/workspace/presentation/schemas";

export function useCurrentWorkspace() {
  return useQuery({
    queryKey: workspaceKeys.current,
    queryFn: fetchCurrentWorkspace,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input),
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success(`Workspace "${workspace.name}" ready`);
    },
    onError: () => {
      toast.error("Could not create workspace. Please try again.");
    },
  });
}

export function useUpdateWorkspaceSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateWorkspaceSettingsInput) => updateWorkspaceSettings(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success("Workspace updated.");
    },
    onError: () => {
      toast.error("Could not update workspace.");
    },
  });
}
