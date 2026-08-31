import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("skeleton-shimmer bg-muted rounded-md", className)} aria-hidden {...props} />
  );
}

function ConversationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      <div className="flex gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-12 w-2/3 rounded-lg" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-1/2 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-16 w-3/4 rounded-lg" />
      </div>
    </div>
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border-border space-y-3 rounded-xl border p-5", className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

function TableSkeleton({ className, rows = 4 }: { className?: string; rows?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  );
}

function MetricSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border-border space-y-2 rounded-xl border p-4", className)}>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-7 w-24" />
    </div>
  );
}

function ProfileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export {
  Skeleton,
  ConversationSkeleton,
  CardSkeleton,
  TableSkeleton,
  MetricSkeleton,
  ProfileSkeleton,
};
