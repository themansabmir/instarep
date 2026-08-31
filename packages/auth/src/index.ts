import { getAuth } from "./server";

export { getAuth } from "./server";
export { getAuthEnv } from "./env";
export type { AuthEnv } from "./env";

export type Session = Awaited<ReturnType<typeof getSession>>;

export async function getSession(requestHeaders: Headers) {
  const auth = getAuth();
  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export class UnauthorizedSessionError extends Error {
  readonly code = "unauthorized";
  readonly statusCode = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedSessionError";
  }
}

export async function requireSession(requestHeaders: Headers) {
  const session = await getSession(requestHeaders);
  if (!session?.user) {
    throw new UnauthorizedSessionError();
  }
  return session;
}
