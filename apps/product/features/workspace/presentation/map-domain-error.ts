import {
  WorkspaceAccessDeniedError,
  WorkspaceNotFoundError,
  WorkspaceSlugConflictError,
  WorkspaceValidationError,
} from "@/features/workspace/domain/errors";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError,
} from "@/lib/errors";

export function mapWorkspaceDomainError(error: unknown): unknown {
  if (error instanceof WorkspaceValidationError) {
    return new UnprocessableEntityError(error.message);
  }
  if (error instanceof WorkspaceAccessDeniedError) {
    return new UnauthorizedError(error.message);
  }
  if (error instanceof WorkspaceNotFoundError) {
    return new NotFoundError(error.message);
  }
  if (error instanceof WorkspaceSlugConflictError) {
    return new ConflictError(error.message);
  }
  return error;
}
