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
    ],
    // Allow unoptimized images for local uploads
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
