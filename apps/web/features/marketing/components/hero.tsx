import { ArrowRight } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center">
      <Badge variant="secondary">Now in public beta</Badge>
      <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Turn customer feedback into your best growth channel
      </h1>
      <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
        {siteConfig.description}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <a href={`${siteConfig.appUrl}/signup`}>
            Start for free
            <ArrowRight />
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="/pricing">View pricing</a>
        </Button>
      </div>
    </section>
  );
}
