import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { env } from "@/lib/env";

/**
 * Staging/preview environments must never be indexed by search engines.
 */
const shouldIndex = env.NEXT_PUBLIC_APP_ENV === "production";

/**
 * Site-wide metadata defaults. Page-level metadata inherits and overrides
 * these via the Next.js Metadata API (through `createMetadata`).
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Reputation & review platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Reputation & review platform`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Reputation & review platform`,
    description: siteConfig.description,
    creator: siteConfig.twitter,
  },
  robots: {
    index: shouldIndex,
    follow: shouldIndex,
    googleBot: {
      index: shouldIndex,
      follow: shouldIndex,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

type CreateMetadataInput = {
  title?: string;
  description?: string;
  /** Path relative to the site root, e.g. "/pricing". Used for canonical + OG url. */
  path?: string;
  image?: string;
  noIndex?: boolean;
};

/**
 * Build page-level metadata with correct canonical URLs and Open Graph data
 * while inheriting the site-wide defaults.
 */
export function createMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
}: CreateMetadataInput = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const resolvedDescription = description ?? siteConfig.description;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical: path },
    openGraph: {
      title: title ?? undefined,
      description: resolvedDescription,
      url,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title: title ?? undefined,
      description: resolvedDescription,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
