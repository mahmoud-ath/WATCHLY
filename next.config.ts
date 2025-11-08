import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true, // Disable Next.js image optimization for external images
  },
  // Remove experimental features for now
};

export default nextConfig;