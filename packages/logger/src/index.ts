/**
 * Zero-dependency, framework-agnostic structured logger.
 *
 * - Pretty, human-readable output in development.
 * - Single-line JSON in production (easy to ship to a log aggregator).
 * - Scoped child loggers so every log line carries its origin.
 *
 * It only relies on `console`, so it is safe in Node, edge and browser
 * runtimes and can be used from any architectural layer.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

export interface Logger {
  debug(message: string, fields?: LogFields): void;
  info(message: string, fields?: LogFields): void;
  warn(message: string, fields?: LogFields): void;
  error(message: string, fields?: LogFields): void;
  /** Create a nested logger that inherits scope and base fields. */
  child(scope: string, fields?: LogFields): Logger;
}

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function readEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

function resolveIsProduction(): boolean {
  return readEnv("NODE_ENV") === "production";
}

function resolveMinLevel(): LogLevel {
  const configured = (readEnv("LOG_LEVEL") ?? readEnv("NEXT_PUBLIC_LOG_LEVEL"))?.toLowerCase();
  if (configured && configured in LEVEL_WEIGHT) {
    return configured as LogLevel;
  }
  return resolveIsProduction() ? "info" : "debug";
}

/** Convert an unknown thrown value into a serializable plain object. */
export function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(("code" in error && { code: (error as { code?: unknown }).code }) || {}),
    };
  }
  return { value: String(error) };
}

const CONSOLE_METHOD: Record<LogLevel, "debug" | "info" | "warn" | "error"> = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
};

function emit(level: LogLevel, scope: string, base: LogFields, message: string, fields?: LogFields) {
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[resolveMinLevel()]) {
    return;
  }

  const merged: LogFields = { ...base, ...fields };
  const method = CONSOLE_METHOD[level];

  if (resolveIsProduction()) {
    console[method](
      JSON.stringify({
        level,
        time: new Date().toISOString(),
        scope,
        message,
        ...merged,
      }),
    );
    return;
  }

  const hasFields = Object.keys(merged).length > 0;
  console[method](`[${level.toUpperCase()}] (${scope}) ${message}`, hasFields ? merged : "");
}

/**
 * Create a scoped logger. Prefer one logger per module/feature, e.g.
 * `const log = createLogger("campaigns:api")`.
 */
export function createLogger(scope: string, baseFields: LogFields = {}): Logger {
  return {
    debug: (message, fields) => emit("debug", scope, baseFields, message, fields),
    info: (message, fields) => emit("info", scope, baseFields, message, fields),
    warn: (message, fields) => emit("warn", scope, baseFields, message, fields),
    error: (message, fields) => emit("error", scope, baseFields, message, fields),
    child: (childScope, fields) =>
      createLogger(`${scope}:${childScope}`, { ...baseFields, ...fields }),
  };
}

/** Application-wide root logger. */
export const logger = createLogger("app");
