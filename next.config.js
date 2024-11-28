/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {

  //⨯ API Routes cannot be used with "output: export".
  // export for building binaries, standalone for dev server
  //output: 'export',
  output: 'standalone',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
}

import NextBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default withBundleAnalyzer(config)
