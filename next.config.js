/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Static export for Cloudflare Pages
  output: 'export',
};

module.exports = nextConfig;
