import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/logger", "@repo/db"],
  // Keep Prisma's query engine out of the bundle; it is loaded at runtime.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
