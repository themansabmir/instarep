import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/logger"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
