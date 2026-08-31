"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@repo/ui/lib/utils";

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("bg-muted relative h-1.5 w-full overflow-hidden rounded-full", className)}
    value={value}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="bg-primary size-full flex-1 transition-transform"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
