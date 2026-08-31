import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  dot?: boolean;
  tone?: "muted" | "brand" | "ai" | "revenue" | "success";
}

const dotTone: Record<NonNullable<SectionLabelProps["tone"]>, string> = {
  muted: "bg-muted-foreground",
  brand: "bg-brand",
  ai: "bg-gradient-ai",
  revenue: "bg-revenue",
  success: "bg-success",
};

function SectionLabel({
  className,
  children,
  dot = false,
  tone = "muted",
  ...props
}: SectionLabelProps) {
  return (
    <p
      className={cn("text-label text-muted-foreground flex items-center gap-2", className)}
      {...props}
    >
      {dot ? (
        <span className={cn("size-1.5 shrink-0 rounded-full", dotTone[tone])} aria-hidden />
      ) : null}
      {children}
    </p>
  );
}

function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}

function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-12 sm:py-16 lg:py-20", className)} {...props} />;
}

function SectionHeader({
  className,
  label,
  title,
  description,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  label?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-2", className)} {...props}>
      {label ? <SectionLabel dot>{label}</SectionLabel> : null}
      {title ? <h2 className="text-h2 text-balance">{title}</h2> : null}
      {description ? (
        <p className="text-body text-muted-foreground max-w-2xl">{description}</p>
      ) : null}
      {children}
    </div>
  );
}

function Stack({
  className,
  gap = "4",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: "2" | "3" | "4" | "5" | "6" | "8" }) {
  const gaps = {
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "5": "gap-5",
    "6": "gap-6",
    "8": "gap-8",
  } as const;

  return <div className={cn("flex flex-col", gaps[gap], className)} {...props} />;
}

function Inline({
  className,
  gap = "2",
  wrap = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  gap?: "1" | "2" | "3" | "4" | "6";
  wrap?: boolean;
}) {
  const gaps = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
  } as const;

  return (
    <div
      className={cn("flex items-center", wrap && "flex-wrap", gaps[gap], className)}
      {...props}
    />
  );
}

function Grid({
  className,
  cols = 3,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { cols?: 1 | 2 | 3 | 4 }) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  } as const;

  return <div className={cn("grid gap-4", colClass[cols], className)} {...props} />;
}

function Divider({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("border-border", className)} {...props} />;
}

export { Container, Section, SectionHeader, SectionLabel, Stack, Inline, Grid, Divider };
