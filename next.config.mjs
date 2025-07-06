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
      // Cloudinary domain for image uploads
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Add your domain for production (keeping for backward compatibility)
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
        ? ["hotel-app-n9ce.onrender.com", "res.cloudinary.com"]
        : ["res.cloudinary.com"],
  },
  // Ensure static files are properly served (keeping for backward compatibility)
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
