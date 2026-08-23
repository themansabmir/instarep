import { env } from "@/lib/env";

/**
 * Single source of truth for marketing-site metadata used across SEO,
 * structured data and navigation.
 */
export const siteConfig = {
  name: "Instarep",
  shortName: "Instarep",
  description:
    "Instarep is the reputation and review platform that helps modern businesses collect, monitor and act on customer feedback.",
  url: env.NEXT_PUBLIC_SITE_URL,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  locale: "en_US",
  twitter: "@instarep",
  keywords: [
    "reputation management",
    "review platform",
    "customer feedback",
    "online reviews",
    "SaaS",
  ],
  links: {
    twitter: "https://twitter.com/instarep",
    github: "https://github.com/instarep",
  },
  contactEmail: "hello@instarep.com",
} as const;

export type SiteConfig = typeof siteConfig;

export const mainNav = [
  { title: "Features", href: "/#features" },
  { title: "Pricing", href: "/pricing" },
  { title: "FAQ", href: "/#faq" },
] as const;
