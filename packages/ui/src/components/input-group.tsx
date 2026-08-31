"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Input, type InputProps } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
}

function InputGroup({
  className,
  label,
  htmlFor,
  hint,
  error,
  children,
  ...props
}: InputGroupProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="text-caption text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-caption text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function SearchInput({ className, ...props }: Omit<InputProps, "type">) {
  return (
    <div className="relative">
      <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
      <Input type="search" className={cn("pl-8", className)} {...props} />
    </div>
  );
}

const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn("pr-16", className)}
          {...props}
        />
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-sm px-1.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2"
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { InputGroup, SearchInput, PasswordInput };
