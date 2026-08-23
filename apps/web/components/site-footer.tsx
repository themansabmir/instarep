import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <nav className="flex items-center gap-6" aria-label="Footer">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <a href={siteConfig.links.twitter} className="transition-colors hover:text-foreground">
            Twitter
          </a>
          <a href={siteConfig.links.github} className="transition-colors hover:text-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
