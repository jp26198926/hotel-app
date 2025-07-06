import { useState } from "react";
import Image from "next/image";

/**
 * SafeImage component that handles local uploads, Cloudinary images, and external images
 * Uses Next.js Image with proper optimization for Cloudinary and external sources
 */
export default function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallback = null,
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  // Check if it's a local upload or Cloudinary image
  const isLocalUpload = src && src.startsWith("/uploads/");
  const isCloudinaryImage = src && src.includes("res.cloudinary.com");

  if (imageError && fallback) {
    return fallback;
  }

  if (imageError || !src) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      // Use unoptimized only for local uploads
      unoptimized={isLocalUpload}
      // Add proper error handling
      onError={() => {
        console.error("Image failed to load:", src);
        setImageError(true);
      }}
      // Ensure proper loading behavior
      priority={false}
      // Use better quality for Cloudinary images since they're optimized
      quality={isCloudinaryImage ? 80 : isLocalUpload ? 100 : 75}
      {...props}
    />
  );
}
