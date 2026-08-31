import { getInstagramEnv } from "./env";

export function getInstagramApiUrl(path: string): string {
  const env = getInstagramEnv();
  const base = env.INSTAGRAM_API_BASE_URL.replace(/\/$/, "");
  const version = env.INSTAGRAM_API_VERSION.replace(/^\/|\/$/g, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${version}${normalizedPath}`;
}

export function getInstagramOAuthUrl(): string {
  return "https://www.instagram.com/oauth/authorize";
}

export function getInstagramScopes(): string[] {
  return [
    "instagram_business_basic",
    "instagram_business_manage_messages",
    "instagram_business_manage_comments",
  ];
}

export function buildInstagramAuthUrl(state: string): string {
  const env = getInstagramEnv();
  const params = new URLSearchParams({
    client_id: env.INSTAGRAM_APP_ID,
    redirect_uri: env.INSTAGRAM_REDIRECT_URI,
    response_type: "code",
    scope: getInstagramScopes().join(","),
    state,
  });
  return `${getInstagramOAuthUrl()}?${params.toString()}`;
}
