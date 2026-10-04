import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The project lives inside the user home directory, so pin the bundler root
  // to keep lockfile resolution and file watching scoped to this project.
  turbopack: { root: process.cwd() },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1536, 1920, 2400],
  },
};

export default nextConfig;
