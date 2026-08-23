import type { Metadata } from "next";

import { JsonLd, softwareApplicationSchema } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";
import { FaqSection } from "@/features/marketing/components/faq-section";
import { FeatureGrid } from "@/features/marketing/components/feature-grid";
import { Hero } from "@/features/marketing/components/hero";

export const metadata: Metadata = createMetadata({ path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd schema={softwareApplicationSchema()} />
      <Hero />
      <FeatureGrid />
      <FaqSection />
    </>
  );
}
