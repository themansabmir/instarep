import * as React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Card } from "@repo/ui/components/card";
import { SectionLabel } from "@repo/ui/components/layout";
import { cn } from "@repo/ui/lib/utils";

export type RevenueState = "opportunity" | "pending" | "converted" | "attributed";

const revenueStateClass: Record<RevenueState, string> = {
  opportunity: "bg-revenue-opportunity/12 text-revenue-opportunity",
  pending: "bg-revenue-pending/12 text-revenue-pending",
  converted: "bg-revenue-converted/12 text-revenue-converted",
  attributed: "bg-revenue-attributed/12 text-revenue-attributed",
};

function RevenueBadge({
  className,
  state = "converted",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { state?: RevenueState }) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", revenueStateClass[state], className)}
      {...props}
    >
      {children ?? state}
    </Badge>
  );
}

function RevenueMetric({
  className,
  label,
  value,
  hint,
}: {
  className?: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function RevenueCard({
  className,
  label,
  value,
  hint,
}: {
  className?: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card variant="revenue" className={cn("p-5", className)}>
      <RevenueMetric label={label} value={value} hint={hint} />
    </Card>
  );
}

function RevenueEvent({
  className,
  title,
  amount,
  time,
  state = "converted",
}: {
  className?: string;
  title: string;
  amount: string;
  time?: string;
  state?: RevenueState;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-2", className)}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>
        {time ? <p className="text-caption text-muted-foreground">{time}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{amount}</span>
        <RevenueBadge state={state} />
      </div>
    </div>
  );
}

const defaultPipeline = ["Intent", "Recommendation", "Click", "Conversion", "Revenue"] as const;

function RevenuePipeline({
  className,
  steps = defaultPipeline,
  activeIndex = 0,
}: {
  className?: string;
  steps?: readonly string[];
  activeIndex?: number;
}) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-2", className)}>
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          <span
            className={cn(
              "text-caption rounded-md px-2 py-1 font-medium",
              index <= activeIndex
                ? "bg-revenue/12 text-revenue"
                : "bg-muted text-muted-foreground",
            )}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <ArrowRight className="text-muted-foreground size-3.5" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function ConversionIndicator({
  className,
  value,
  direction = "up",
}: {
  className?: string;
  value: string;
  direction?: "up" | "down";
}) {
  const Icon = direction === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "text-caption inline-flex items-center gap-0.5 font-medium",
        direction === "up" ? "text-success" : "text-destructive",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {value}
    </span>
  );
}

export {
  RevenueBadge,
  RevenueMetric,
  RevenueCard,
  RevenueEvent,
  RevenuePipeline,
  ConversionIndicator,
};
