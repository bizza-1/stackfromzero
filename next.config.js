const { withContentlayer } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Contentlayer generates ESM; allow Next to transpile it cleanly.
  experimental: {
    // No experimental flags needed for Next 14.2 + contentlayer2.
  },
};

module.exports = withContentlayer(nextConfig);
