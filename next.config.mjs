/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

// GitHub Pages serves project sites from /<repo>/, so builds produced inside
// GitHub Actions are prefixed automatically. Local builds stay at the domain
// root (so `npm run build && npm start` just works), and NEXT_PUBLIC_BASE_PATH
// can force any prefix explicitly on any platform.
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath =
  envBasePath !== undefined
    ? envBasePath
    : process.env.GITHUB_ACTIONS === 'true'
    ? '/oxford-3000-platform'
    : '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',

  // CRITICAL: keep the dev server cache in its own folder so running
  // `next build` never overwrites the artifacts a live `next dev` is serving
  // (that mismatch produced 404 chunk URLs and a blank screen).
  distDir: isProd ? '.next' : '.next-dev',

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
  allowedDevOrigins: ['*.e2b.app', '*.arena.app', 'localhost', '127.0.0.1'],
};

export default nextConfig;
