import type { Thing, WithContext } from "schema-dts";

import { siteConfig } from "@/config/site";

/**
 * Renders a JSON-LD script tag for any Schema.org type. Keep the input
 * strongly typed via `schema-dts` so structured data stays accurate.
 */
export function JsonLd<T extends Thing>({ schema }: { schema: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, server-generated content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function organizationSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: new URL("/logo.png", siteConfig.url).toString(),
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  } as WithContext<Thing>;
}

export function websiteSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  } as WithContext<Thing>;
}

export function softwareApplicationSchema(): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  } as WithContext<Thing>;
}

export function faqSchema(items: { question: string; answer: string }[]): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as WithContext<Thing>;
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): WithContext<Thing> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  } as WithContext<Thing>;
}
