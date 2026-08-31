import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted read-only:text-muted-foreground",
  {
    variants: {
      fieldSize: {
        sm: "h-8 text-xs",
        md: "h-9",
        lg: "h-11",
      },
      state: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      fieldSize: "md",
      state: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, fieldSize, state, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const resolvedState = ariaInvalid ? "error" : state;

    return (
      <input
        type={type}
        className={cn(inputVariants({ fieldSize, state: resolvedState }), className)}
        ref={ref}
        aria-invalid={ariaInvalid}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
