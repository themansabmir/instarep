import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not transpile @repo/db — it embeds Prisma's native query engine.
  transpilePackages: ["@repo/ui", "@repo/logger", "@repo/auth", "@repo/instagram"],
  // Keep Prisma and the db package out of the webpack bundle (custom client output path).
  serverExternalPackages: ["@prisma/client", "@repo/db"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
