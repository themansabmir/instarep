import { getInstagramApiUrl } from "./config";
import { InstagramError, mapMetaApiError } from "./errors";

export interface InstagramProfile {
  id: string;
  user_id?: string;
  username?: string;
  name?: string;
  profile_picture_url?: string;
  biography?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  account_type?: string;
}

export async function fetchInstagramProfile(accessToken: string): Promise<InstagramProfile> {
  const fields = [
    "id",
    "user_id",
    "username",
    "name",
    "profile_picture_url",
    "biography",
    "followers_count",
    "follows_count",
    "media_count",
    "account_type",
  ].join(",");

  const url = `${getInstagramApiUrl("/me")}?fields=${fields}&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data = (await response.json()) as InstagramProfile & { error?: { message?: string } };

    if (!response.ok || data.error) {
      throw new InstagramError(
        "account_lookup_failed",
        "Could not retrieve Instagram account information.",
        400,
      );
    }

    return data;
  } catch (error) {
    throw mapMetaApiError(error);
  }
}

export function validateProfessionalAccount(profile: InstagramProfile): void {
  const accountType = profile.account_type?.toUpperCase();
  if (accountType && accountType !== "BUSINESS" && accountType !== "MEDIA_CREATOR") {
    throw new InstagramError(
      "unsupported_account",
      "Only Instagram Professional (Business or Creator) accounts are supported.",
    );
  }
}

export function getInstagramUserId(profile: InstagramProfile): string {
  return profile.user_id ?? profile.id;
}
