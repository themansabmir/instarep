import * as React from "react";
import { Sparkles } from "lucide-react";

import { Avatar, type AvatarStatus } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button, type ButtonProps } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import { SectionLabel } from "@repo/ui/components/layout";
import { cn } from "@repo/ui/lib/utils";

function AIIndicator({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "bg-gradient-ai inline-flex size-5 items-center justify-center rounded-full text-white",
        className,
      )}
      aria-hidden
      {...props}
    >
      <Sparkles className="size-3" />
    </span>
  );
}

function AIStatus({
  className,
  label = "AI PERSONA",
  state = "ACTIVE",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { label?: string; state?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <AIIndicator />
      <SectionLabel tone="ai">
        {label} · {state}
      </SectionLabel>
    </div>
  );
}

function PersonaBadge({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Badge variant="ai" className={className} {...props}>
      {children}
    </Badge>
  );
}

function IntentBadge({
  className,
  children = "Intent detected",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Badge variant="brand" className={cn("animate-intent-detected", className)} {...props}>
      {children}
    </Badge>
  );
}

function ThinkingIndicator({
  className,
  label = "Understanding intent…",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { label?: string }) {
  return (
    <p
      className={cn("text-muted-foreground flex items-center gap-2 text-sm", className)}
      aria-live="polite"
      {...props}
    >
      <span className="flex gap-1" aria-hidden>
        <span className="bg-ai animate-ai-thinking size-1.5 rounded-full" />
        <span className="bg-ai animate-ai-thinking size-1.5 rounded-full [animation-delay:150ms]" />
        <span className="bg-ai animate-ai-thinking size-1.5 rounded-full [animation-delay:300ms]" />
      </span>
      {label}
    </p>
  );
}

function AIAvatar({
  className,
  src,
  fallback = "AI",
  status = "ai-active",
  size = "md",
}: {
  className?: string;
  src?: string;
  fallback?: string;
  status?: AvatarStatus;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) {
  return (
    <Avatar
      className={cn("ring-ai-border ring-2", className)}
      src={src}
      fallback={fallback}
      status={status}
      size={size}
    />
  );
}

function AIActivity({
  className,
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <Card variant="ai" className={cn("p-4", className)} {...props}>
      <AIStatus />
      {title ? <p className="mt-3 font-medium">{title}</p> : null}
      <div className="text-muted-foreground mt-2 text-sm">{children}</div>
    </Card>
  );
}

function AIAction({ className, children, ...props }: ButtonProps) {
  return (
    <Button variant="brand" size="sm" className={className} leftIcon={<Sparkles />} {...props}>
      {children}
    </Button>
  );
}

function AIMessage({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("animate-message-enter flex max-w-[85%] gap-2", className)} {...props}>
      <AIAvatar size="sm" />
      <div className="border-ai-border bg-ai-subtle rounded-lg rounded-tl-sm border px-3 py-2 text-sm">
        {children}
      </div>
    </div>
  );
}

export {
  AIIndicator,
  AIStatus,
  PersonaBadge,
  IntentBadge,
  ThinkingIndicator,
  AIAvatar,
  AIActivity,
  AIAction,
  AIMessage,
};
