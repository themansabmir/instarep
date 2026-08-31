import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { UnauthorizedSessionError } from "@repo/auth";
import { InstagramError } from "@repo/instagram";
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

const SENSITIVE_KEY_PATTERN = /token|secret|password|authorization/i;

function sanitizeFields(fields: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      sanitized[key] = "[redacted]";
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function errorResponse(status: number, body: ErrorBody): NextResponse {
  return NextResponse.json(body, { status });
}

/**
 * Translate any thrown value into a consistent JSON error response and log it.
 * Expected errors (validation, AppError) are logged at `warn`; everything else
 * is treated as an unexpected server error and logged at `error`.
 */
export function toErrorResponse(error: unknown, log = apiLogger, requestId?: string): NextResponse {
  const logFields = requestId ? { requestId } : undefined;

  if (error instanceof ZodError) {
    log.warn("Request validation failed", { ...logFields, issues: error.flatten() });
    return errorResponse(400, {
      error: { code: "validation_error", message: "Invalid request", details: error.flatten() },
    });
  }

  if (error instanceof UnauthorizedSessionError) {
    log.warn(error.message, { ...logFields, code: error.code });
    return errorResponse(401, {
      error: { code: error.code, message: error.message },
    });
  }

  if (error instanceof InstagramError) {
    log.warn(error.safeMessage, { ...logFields, code: error.code });
    return errorResponse(error.statusCode, {
      error: { code: error.code, message: error.safeMessage },
    });
  }

  if (isAppError(error)) {
    const level = error.statusCode >= 500 ? "error" : "warn";
    log[level](error.message, {
      ...logFields,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details ? sanitizeFields(error.details as Record<string, unknown>) : undefined,
    });
    return errorResponse(error.statusCode, {
      error: { code: error.code, message: error.message, details: error.details },
    });
  }

  log.error("Unhandled server error", {
    ...logFields,
    error: sanitizeFields(serializeError(error) as Record<string, unknown>),
  });
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
    const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
    try {
      log.debug("Request received", {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
      });
      const response = await handler(request, context);
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (error) {
      const response = toErrorResponse(error, log, requestId);
      response.headers.set("x-request-id", requestId);
      return response;
    }
  };
}

/** Re-exported for convenience so routes import a single module. */
export { AppError };
