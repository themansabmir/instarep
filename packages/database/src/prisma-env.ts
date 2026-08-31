/**
 * Prisma ships only an x64 Node-API library for Windows. Native ARM64 Node
 * cannot load it in-process; use the query-engine binary subprocess instead.
 * https://github.com/prisma/prisma/issues/25206
 */
if (process.platform === "win32" && process.arch === "arm64") {
  process.env.PRISMA_CLIENT_ENGINE_TYPE ??= "binary";
}
