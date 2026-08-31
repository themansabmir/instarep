/** Raised when a domain invariant is violated (independent of transport). */
export class WorkspaceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceValidationError";
  }
}

export class WorkspaceAccessDeniedError extends Error {
  constructor(message = "You do not have access to this workspace.") {
    super(message);
    this.name = "WorkspaceAccessDeniedError";
  }
}

export class WorkspaceNotFoundError extends Error {
  constructor(message = "Workspace not found.") {
    super(message);
    this.name = "WorkspaceNotFoundError";
  }
}

export class WorkspaceSlugConflictError extends Error {
  constructor(message = "Could not generate a unique workspace slug. Try a different name.") {
    super(message);
    this.name = "WorkspaceSlugConflictError";
  }
}
