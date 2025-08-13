import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/nextapi/:path*',
        destination: '/api/:path*',
      },
    ];
  },
 typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  
};

export default nextConfig;
