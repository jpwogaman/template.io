// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env.mjs'))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  // Note: This experimental feature is required to use NextJS Image in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.

  //⨯ API Routes cannot be used with "output: export".
  // export for building binaries, standalone for dev server
  //output: 'export',
  output: 'standalone',
  distDir: 'dist',
  images: {
    unoptimized: true
  }
}
export default config
