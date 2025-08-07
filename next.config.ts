import type { NextConfig } from "next";

const API_URL = process.env.API_URL;

const nextConfig: NextConfig = {
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
