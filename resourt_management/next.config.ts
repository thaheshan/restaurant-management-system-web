import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // This explicitly forces the project root to be this folder,
  // stopping Next.js from being confused by the files in your parent folder.
  turbopack: {
    root: path.resolve('.'),
  },
}

export default nextConfig