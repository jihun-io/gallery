import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jihun.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
