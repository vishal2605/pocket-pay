/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/_next/static/:path*',
        destination: '/_next/static/:path*',
      },
    ];
  },
  webpack: (config) => {
    // Add alias for @repo/db
    config.resolve.alias['@repo/db'] = path.resolve(__dirname, '../../packages/db');

    return config;
  },
};
