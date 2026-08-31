"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  action,
}: {
  className?: string;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3 py-10", className)}>
      {Icon ? (
        <span className="border-border bg-subtle flex size-9 items-center justify-center rounded-lg border">
          <Icon className="text-muted-foreground size-4" aria-hidden />
        </span>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-muted-foreground max-w-md text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function ErrorState({
  className,
  title = "Something went wrong",
  description,
  onRetry,
}: {
  className?: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className={cn("space-y-3 py-8", className)} role="alert">
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

function SuccessState({
  className,
  title,
  description,
}: {
  className?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={cn("space-y-1 py-8", className)}>
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
    </div>
  );
}

function LoadingState({ className, label = "Loading…" }: { className?: string; label?: string }) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} aria-live="polite">
      {label}
    </p>
  );
}

export { EmptyState, ErrorState, SuccessState, LoadingState };
