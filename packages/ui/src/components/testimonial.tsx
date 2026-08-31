"use client";

import * as React from "react";

import { Avatar } from "@repo/ui/components/avatar";
import { cn } from "@repo/ui/lib/utils";

function TestimonialCard({
  className,
  quote,
  name,
  role,
  avatar,
}: {
  className?: string;
  quote: string;
  name: string;
  role?: string;
  avatar?: string;
}) {
  return (
    <figure
      className={cn("border-border bg-card shadow-xs min-w-72 rounded-xl border p-5", className)}
    >
      <blockquote className="text-pretty text-sm">“{quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-2">
        <Avatar src={avatar} fallback={name} size="sm" />
        <div>
          <p className="text-sm font-medium">{name}</p>
          {role ? <p className="text-caption text-muted-foreground">{role}</p> : null}
        </div>
      </figcaption>
    </figure>
  );
}

function TestimonialCarousel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="animate-marquee flex w-max gap-4 motion-reduce:animate-none">
        {children}
        {children}
      </div>
    </div>
  );
}

function LogoCloud({ className, logos }: { className?: string; logos: { name: string }[] }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-6", className)}>
      {logos.map((logo) => (
        <span key={logo.name} className="text-muted-foreground text-sm font-medium">
          {logo.name}
        </span>
      ))}
    </div>
  );
}

function CreatorQuote(props: React.ComponentProps<typeof TestimonialCard>) {
  return <TestimonialCard {...props} />;
}

export { TestimonialCard, TestimonialCarousel, LogoCloud, CreatorQuote };
