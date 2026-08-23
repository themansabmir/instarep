import { BarChart3, MessageSquare, ShieldCheck, Star } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card";

const features = [
  {
    icon: Star,
    title: "Collect reviews",
    description: "Automate review requests across email and SMS to grow your rating.",
  },
  {
    icon: MessageSquare,
    title: "Respond faster",
    description: "Manage every review from a single inbox with suggested replies.",
  },
  {
    icon: BarChart3,
    title: "Track sentiment",
    description: "Understand trends over time with clear, actionable analytics.",
  },
  {
    icon: ShieldCheck,
    title: "Protect your brand",
    description: "Get alerted the moment negative feedback needs your attention.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">Everything you need to manage reputation</h2>
        <p className="mt-3 text-muted-foreground">
          A focused toolkit that scales from your first review to millions.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 size-6 text-primary" aria-hidden />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
