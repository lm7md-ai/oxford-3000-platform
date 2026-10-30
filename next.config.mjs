/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/oxford-3000-platform' : '',
  assetPrefix: isProd ? '/oxford-3000-platform/' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow the Arena preview proxy origin to load dev assets
  allowedDevOrigins: ['*.e2b.app', 'localhost', '127.0.0.1'],
};

export default nextConfig;
