import { getInstagramEnv } from "./env";
import { InstagramError, mapMetaApiError } from "./errors";

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

export async function exchangeCodeForShortLivedToken(code: string): Promise<TokenResponse> {
  const env = getInstagramEnv();

  const params = new URLSearchParams({
    client_id: env.INSTAGRAM_APP_ID,
    client_secret: env.INSTAGRAM_APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: env.INSTAGRAM_REDIRECT_URI,
    code,
  });

  try {
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await response.json()) as TokenResponse & {
      error_message?: string;
      error_type?: string;
    };

    if (!response.ok || !data.access_token) {
      throw new InstagramError(
        "token_exchange_failed",
        "Could not exchange authorization code for an access token.",
        400,
      );
    }

    return data;
  } catch (error) {
    throw mapMetaApiError(error);
  }
}

export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<TokenResponse> {
  const env = getInstagramEnv();
  const url = new URL(`${env.INSTAGRAM_API_BASE_URL.replace(/\/$/, "")}/access_token`);
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", env.INSTAGRAM_APP_SECRET);
  url.searchParams.set("access_token", shortLivedToken);

  try {
    const response = await fetch(url.toString());
    const data = (await response.json()) as TokenResponse & { error?: { message?: string } };

    if (!response.ok || !data.access_token) {
      throw new InstagramError(
        "token_exchange_failed",
        "Could not obtain a long-lived access token.",
        400,
      );
    }

    return data;
  } catch (error) {
    throw mapMetaApiError(error);
  }
}
