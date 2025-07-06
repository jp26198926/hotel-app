/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      // Add your domain for production
      {
        protocol: "https",
        hostname: "hotel-app-n9ce.onrender.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
    // Allow unoptimized images for development and production uploads
    unoptimized:
      process.env.NODE_ENV === "development" || process.env.VERCEL !== "1",
    // Add domain allowlist for production
    domains:
      process.env.NODE_ENV === "production"
        ? ["hotel-app-n9ce.onrender.com"]
        : [],
  },
  // Ensure static files are properly served
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
