import { NextResponse } from "next/server";

import { db } from "@repo/db";

import { withApiHandler } from "@/lib/api/handler";

export const GET = withApiHandler("health", async () => {
  let dbStatus: "ok" | "error" = "ok";

  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "ok" ? "ok" : "degraded";

  return NextResponse.json({
    status,
    db: dbStatus,
    version: process.env.npm_package_version ?? "0.0.0",
    timestamp: new Date().toISOString(),
  });
});
