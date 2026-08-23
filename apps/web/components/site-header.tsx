import Link from "next/link";

import { Button } from "@repo/ui/components/button";

import { mainNav, siteConfig } from "@/config/site";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block size-6 rounded-md bg-primary" aria-hidden />
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="ghost" size="sm">
            <a href={`${siteConfig.appUrl}/login`}>Sign in</a>
          </Button>
          <Button asChild size="sm">
            <a href={`${siteConfig.appUrl}/signup`}>Get started</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
