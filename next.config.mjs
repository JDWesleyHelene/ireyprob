/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:    { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  },

  // Compress all responses with gzip
  compress: true,

  // Allow all image domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ireyprod.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
    // Serve WebP/AVIF automatically
    formats: ["image/avif", "image/webp"],
    // Cache images for 1 year
    minimumCacheTTL: 31536000,
  },

  // Cache headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Cache static assets for 1 year
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Cache images for 30 days
        source: "/(.*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico))",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
