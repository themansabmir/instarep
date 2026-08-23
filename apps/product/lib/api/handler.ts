import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logger, serializeError } from "@repo/logger";

import { AppError, isAppError } from "@/lib/errors";

const apiLogger = logger.child("api");

export type RouteContext = { params: Promise<Record<string, string | string[]>> };

type RouteHandler = (request: Request, context: RouteContext) => Promise<Response> | Response;

interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

function errorResponse(status: number, body: ErrorBody): NextResponse {
  return NextResponse.json(body, { status });
}

/**
 * Translate any thrown value into a consistent JSON error response and log it.
 * Expected errors (validation, AppError) are logged at `warn`; everything else
 * is treated as an unexpected server error and logged at `error`.
 */
export function toErrorResponse(error: unknown, log = apiLogger): NextResponse {
  if (error instanceof ZodError) {
    log.warn("Request validation failed", { issues: error.flatten() });
    return errorResponse(400, {
      error: { code: "validation_error", message: "Invalid request", details: error.flatten() },
    });
  }

  if (isAppError(error)) {
    const level = error.statusCode >= 500 ? "error" : "warn";
    log[level](error.message, { code: error.code, statusCode: error.statusCode });
    return errorResponse(error.statusCode, {
      error: { code: error.code, message: error.message, details: error.details },
    });
  }

  log.error("Unhandled server error", { error: serializeError(error) });
  return errorResponse(500, {
    error: { code: "internal_error", message: "Something went wrong." },
  });
}

/**
 * Wrap a Next.js route handler with centralized try/catch, logging and error
 * mapping. Handlers stay focused on the happy path.
 */
export function withApiHandler(scope: string, handler: RouteHandler): RouteHandler {
  const log = apiLogger.child(scope);
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return toErrorResponse(error, log);
    }
  };
}

/** Re-exported for convenience so routes import a single module. */
export { AppError };
