import type { NextConfig } from "next";
import { API_URL } from "@/config/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/apis/:path*',
        destination: `${API_URL}/api/:path*`,
        basePath: false,
      }
    ]
  },
};

export default nextConfig;
