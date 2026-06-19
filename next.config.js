/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Force Webpack — Turbopack native bindings unavailable on android/arm64
  webpack: (config) => config,
}

module.exports = nextConfig
