import { headers } from "next/headers";

import { getSession as getAuthSession, requireSession as requireAuthSession } from "@repo/auth";

export async function getSession() {
  return getAuthSession(await headers());
}

export async function requireSession() {
  return requireAuthSession(await headers());
}
