"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Instagram, LayoutDashboard, Megaphone, Settings } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Campaigns", href: "/campaigns", icon: Megaphone },
  { title: "Billing", href: "/billing", icon: CreditCard },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Instagram", href: "/settings/instagram", icon: Instagram },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r md:block">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <span className="bg-gradient-instagram inline-block size-6 rounded-md" aria-hidden />
        Instabot
      </div>
      <nav className="space-y-1 p-3" aria-label="Primary">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
