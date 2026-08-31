import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuth } from "@repo/auth/server";
import { APIError } from "better-auth/api";

import { withApiHandler } from "@/lib/api/handler";

const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export const POST = withApiHandler("auth:set-password", async (request) => {
  const body = setPasswordSchema.parse(await request.json());
  const auth = getAuth();

  try {
    const result = await auth.api.setPassword({
      body: { newPassword: body.newPassword },
      headers: await headers(),
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof APIError) {
      const status = typeof error.status === "number" ? error.status : 400;
      return NextResponse.json({ error: { message: error.message, status } }, { status });
    }

    throw error;
  }
});
