import type { Metadata } from "next";

import { JsonLd, breadcrumbSchema } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { PricingSection } from "@/features/marketing/components/pricing-section";

export const metadata: Metadata = createMetadata({
  title: "Pricing",
  description: "Simple, transparent pricing for teams of every size. Start free.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <PricingSection />
    </>
  );
}
