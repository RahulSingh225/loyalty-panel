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

  webpack(config, { isServer }) {
    // Enable WebAssembly experiments
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true, // Recommended for modern async WebAssembly
      // syncWebAssembly: true, // Deprecated, use only if needed
    };

    // Add rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async', // Use async WebAssembly
      // type: 'webassembly/sync', // Use only if syncWebAssembly is enabled
    });

    return config;
  },
  
};

export default nextConfig;
