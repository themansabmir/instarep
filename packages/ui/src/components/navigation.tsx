"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, Menu } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "border-border bg-background flex h-14 items-center gap-3 border-b px-4",
        className,
      )}
      {...props}
    />
  );
}

function TopBar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <Navbar className={className} {...props} />;
}

function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside
      className={cn(
        "border-sidebar-border bg-sidebar text-sidebar-foreground flex w-56 shrink-0 flex-col border-r",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarItem({
  className,
  active,
  asChild,
  icon,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  asChild?: boolean;
  icon?: React.ReactNode;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "focus-visible:ring-ring flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground",
        className,
      )}
      {...(asChild ? {} : { type: "button" as const })}
      {...props}
    >
      {icon}
      {children}
    </Comp>
  );
}

function Breadcrumb({
  className,
  items,
}: {
  className?: string;
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm", className)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1">
          {index > 0 ? (
            <ChevronRight className="text-muted-foreground size-3.5" aria-hidden />
          ) : null}
          {item.href ? (
            <a href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <span className="font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button variant="ghost" size="icon-sm" className={cn("md:hidden", className)} {...props}>
      <Menu />
      <span className="sr-only">Open navigation</span>
    </Button>
  );
}

export { Navbar, TopBar, Sidebar, SidebarItem, Breadcrumb, SidebarTrigger };
