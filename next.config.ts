import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // You can add custom config here
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
};

export default nextConfig;
