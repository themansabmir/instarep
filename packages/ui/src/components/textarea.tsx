import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  state?: "default" | "error" | "success";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state = "default", "aria-invalid": ariaInvalid, ...props }, ref) => {
    const resolved = ariaInvalid ? "error" : state;

    return (
      <textarea
        className={cn(
          "bg-background shadow-xs placeholder:text-muted-foreground focus-visible:ring-ring read-only:bg-muted flex min-h-20 w-full rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          resolved === "default" && "border-input",
          resolved === "error" && "border-destructive focus-visible:ring-destructive",
          resolved === "success" && "border-success focus-visible:ring-success",
          className,
        )}
        ref={ref}
        aria-invalid={ariaInvalid}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
