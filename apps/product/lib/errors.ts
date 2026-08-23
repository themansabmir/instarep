/**
 * Application error taxonomy. These live at the application/transport boundary
 * (not in the domain layer) and carry enough metadata for the API layer to map
 * them to consistent HTTP responses.
 */
export interface AppErrorOptions {
  statusCode?: number;
  code?: string;
  details?: unknown;
  cause?: unknown;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly expected = true;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? "internal_error";
    this.details = options.details;
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request", details?: unknown) {
    super(message, { statusCode: 400, code: "validation_error", details });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, { statusCode: 401, code: "unauthorized" });
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, { statusCode: 404, code: "not_found" });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, { statusCode: 409, code: "conflict" });
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity", details?: unknown) {
    super(message, { statusCode: 422, code: "unprocessable_entity", details });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
