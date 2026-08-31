import { NextResponse } from "next/server";

import { getInstagramErrorMessage, InstagramError } from "@repo/instagram";

import { getInstagramService } from "@/features/instagram/infrastructure/instagram-module";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");

  const redirectBase = new URL("/settings/instagram", env.NEXT_PUBLIC_APP_URL);

  try {
    const { connectAccount } = getInstagramService();
    await connectAccount({
      code: code ?? undefined,
      state: state ?? undefined,
      error: error ?? undefined,
      errorReason: errorReason ?? undefined,
    });
    redirectBase.searchParams.set("connected", "1");
  } catch (err) {
    const errorCode = err instanceof InstagramError ? err.code : "unknown";
    redirectBase.searchParams.set("error", getInstagramErrorMessage(errorCode));
  }

  return NextResponse.redirect(redirectBase);
}
