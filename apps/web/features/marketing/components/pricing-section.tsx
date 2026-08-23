import { Check } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { siteConfig } from "@/config/site";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "For getting started.",
    features: ["Up to 50 reviews / mo", "1 location", "Email support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$49",
    description: "For growing businesses.",
    features: ["Unlimited reviews", "5 locations", "Analytics dashboard", "Priority support"],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For multi-location brands.",
    features: ["Unlimited locations", "SSO & roles", "API access", "Dedicated manager"],
    cta: "Contact sales",
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you grow.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.featured ? "border-primary shadow-lg" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-baseline justify-between">
                {tier.name}
                <span className="text-2xl font-bold">{tier.price}</span>
              </CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={tier.featured ? "default" : "outline"}
              >
                <a href={`${siteConfig.appUrl}/signup`}>{tier.cta}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
