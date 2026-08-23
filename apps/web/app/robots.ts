import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";

/**
 * Environment-aware robots rules: only production is crawlable, so preview and
 * development deployments are never accidentally indexed.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = env.NEXT_PUBLIC_APP_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
