import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
      "2xl": "size-20",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const statusClass: Record<NonNullable<AvatarStatus>, string> = {
  online: "bg-success",
  active: "bg-success",
  offline: "bg-muted-foreground/50",
  "ai-active": "bg-gradient-ai",
};

export type AvatarStatus = "online" | "active" | "offline" | "ai-active";

export interface AvatarProps
  extends React.ComponentProps<"div">, VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  status?: AvatarStatus;
}

function initialsFrom(value?: string) {
  if (!value) return undefined;
  const parts = value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

function Avatar({ className, src, alt, fallback, status, size, children, ...props }: AvatarProps) {
  const label = initialsFrom(fallback) ?? initialsFrom(alt) ?? fallback ?? "?";

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {children ??
        (src ? (
          <img src={src} alt={alt ?? ""} className="size-full object-cover" />
        ) : (
          <span className="text-muted-foreground flex size-full items-center justify-center text-[0.65em] font-medium">
            {label}
          </span>
        ))}
      {status ? (
        <span
          className={cn(
            "ring-background absolute bottom-0 right-0 size-2.5 rounded-full ring-2",
            statusClass[status],
          )}
          aria-label={status}
        />
      ) : null}
    </div>
  );
}

function AvatarImage({ className, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img alt={alt} className={cn("size-full object-cover", className)} {...props} />;
}

function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex size-full items-center justify-center text-xs font-medium",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  children,
  max = 4,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const extra = items.length - visible.length;

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible}
      {extra > 0 ? (
        <div className="border-background bg-muted text-muted-foreground relative z-10 flex size-8 items-center justify-center rounded-full border text-[10px] font-medium">
          +{extra}
        </div>
      ) : null}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatarVariants };
