import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Merge from next.config.mjs
    ignoreBuildErrors: true,
  },
  images: {
    // Merge from next.config.mjs
    unoptimized: true,
  },
  // Explicitly set the project root for Turbopack to prevent incorrect inference
  // Using process.cwd() to ensure an absolute path to the current project
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig