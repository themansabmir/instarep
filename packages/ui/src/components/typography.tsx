import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

function Display({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-display", className)} {...props} />;
}

function Heading({
  className,
  level = 1,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 }) {
  const styles = {
    1: "text-h1",
    2: "text-h2",
    3: "text-h3",
    4: "text-h4",
  } as const;
  const classNames = cn(styles[level], className);
  if (level === 2) return <h2 className={classNames} {...props} />;
  if (level === 3) return <h3 className={classNames} {...props} />;
  if (level === 4) return <h4 className={classNames} {...props} />;
  return <h1 className={classNames} {...props} />;
}

function Text({
  className,
  size = "body",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { size?: "body" | "lg" | "caption" }) {
  const styles = {
    body: "text-body",
    lg: "text-body-lg",
    caption: "text-caption",
  } as const;
  return <p className={cn(styles[size], className)} {...props} />;
}

export { Display, Heading, Text };
