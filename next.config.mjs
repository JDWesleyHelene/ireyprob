import { imageHosts } from './image-hosts.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: { remotePatterns: imageHosts },
  async redirects() {
    return [{ source: '/home-page', destination: '/', permanent: true }];
  },
};

export default nextConfig;
