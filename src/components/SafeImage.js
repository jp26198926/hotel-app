import { useState } from "react";
import Image from "next/image";

/**
 * SafeImage component that handles both local uploads and external images
 * Uses Next.js Image with unoptimized flag for local uploads to avoid optimization issues
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

  // Check if it's a local upload
  const isLocalUpload = src && src.startsWith("/uploads/");

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
      // Use unoptimized for local uploads to prevent optimization issues
      unoptimized={isLocalUpload}
      // Add proper error handling
      onError={() => {
        console.error("Image failed to load:", src);
        setImageError(true);
      }}
      // Ensure proper loading behavior
      priority={false}
      quality={isLocalUpload ? 100 : 75}
      {...props}
    />
  );
}
