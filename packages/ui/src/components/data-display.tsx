import * as React from "react";

import { Card } from "@repo/ui/components/card";
import { ConversionIndicator } from "@repo/ui/components/revenue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

function MetricCard({
  className,
  label,
  value,
  trend,
  trendDirection,
}: {
  className?: string;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
}) {
  return (
    <Card className={cn("p-4", className)}>
      <p className="text-caption text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <p className="text-xl font-semibold tracking-tight">{value}</p>
        {trend ? <ConversionIndicator value={trend} direction={trendDirection} /> : null}
      </div>
    </Card>
  );
}

function Stat({ className, label, value }: { className?: string; label: string; value: string }) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function Trend({
  className,
  value,
  direction = "up",
}: {
  className?: string;
  value: string;
  direction?: "up" | "down";
}) {
  return <ConversionIndicator className={className} value={value} direction={direction} />;
}

function Progress({
  className,
  value,
  label,
}: {
  className?: string;
  value: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="text-caption text-muted-foreground flex justify-between">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function ProgressRing({
  className,
  value,
  size = 56,
}: {
  className?: string;
  value: number;
  size?: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      className={cn("-rotate-90", className)}
      aria-label={`${clamped} percent`}
    >
      <circle cx="22" cy="22" r={r} fill="none" className="stroke-muted" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        className="stroke-primary"
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c - (clamped / 100) * c}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkline({ className, points }: { className?: string; points: number[] }) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 32 - ((point - min) / span) * 28;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" className={cn("h-8 w-24 overflow-visible", className)} aria-hidden>
      <path d={d} fill="none" className="stroke-primary" strokeWidth="1.75" />
    </svg>
  );
}

function MiniChart({ className, points }: { className?: string; points: number[] }) {
  return <Sparkline className={cn("h-10 w-full", className)} points={points} />;
}

function DataTable({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-border bg-card shadow-xs w-full overflow-x-auto rounded-xl border",
        className,
      )}
      {...props}
    >
      {children ?? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">No rows</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { MetricCard, Stat, Trend, Progress, ProgressRing, Sparkline, MiniChart, DataTable };
