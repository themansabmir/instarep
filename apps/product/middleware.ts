import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup", "/verify-email", "/forgot-password", "/reset-password"];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/campaigns",
  "/billing",
  "/settings",
  "/onboarding",
  "/instagram",
];

const PUBLIC_API_PREFIXES = [
  "/api/auth",
  "/api/webhooks",
  "/api/health",
  "/api/cron",
  "/api/instagram/callback",
];

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api") && isPublicApi(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const responseHeaders = { "x-request-id": requestId };

  if (isProtectedRoute(pathname) && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl, { headers: responseHeaders });
  }

  if (isAuthRoute(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url), { headers: responseHeaders });
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
