import { z } from "zod";

import {
  WORKSPACE_NAME_MAX_LENGTH,
  WORKSPACE_NAME_MIN_LENGTH,
} from "@/features/workspace/domain/workspace";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(WORKSPACE_NAME_MIN_LENGTH, {
      message: `Name must be at least ${WORKSPACE_NAME_MIN_LENGTH} characters.`,
    })
    .max(WORKSPACE_NAME_MAX_LENGTH),
  timezone: z.string().min(1).max(80).optional(),
});

export const updateWorkspaceSettingsSchema = z.object({
  name: z
    .string()
    .min(WORKSPACE_NAME_MIN_LENGTH, {
      message: `Name must be at least ${WORKSPACE_NAME_MIN_LENGTH} characters.`,
    })
    .max(WORKSPACE_NAME_MAX_LENGTH)
    .optional(),
  timezone: z.string().min(1).max(80).optional(),
});

/** Full settings form always submits name and timezone together. */
export const workspaceSettingsFormSchema = z.object({
  name: z
    .string()
    .min(WORKSPACE_NAME_MIN_LENGTH, {
      message: `Name must be at least ${WORKSPACE_NAME_MIN_LENGTH} characters.`,
    })
    .max(WORKSPACE_NAME_MAX_LENGTH),
  timezone: z.string().min(1).max(80),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceSettingsInput = z.infer<typeof updateWorkspaceSettingsSchema>;
export type WorkspaceSettingsFormInput = z.infer<typeof workspaceSettingsFormSchema>;
