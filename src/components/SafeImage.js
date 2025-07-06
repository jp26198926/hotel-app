import { useState } from "react";
import Image from "next/image";

/**
 * SafeImage component that handles both local uploads and external images
 * Falls back to regular img tag for local uploads on production
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
  const [imgFallback, setImgFallback] = useState(false);

  // Check if it's a local upload
  const isLocalUpload = src && src.startsWith("/uploads/");

  // In production, use regular img for local uploads to avoid Next.js optimization issues
  const useRegularImg = process.env.NODE_ENV === "production" && isLocalUpload;

  if (imageError && fallback) {
    return fallback;
  }

  if (imageError || !src) {
    return null;
  }

  if (useRegularImg || imgFallback) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${className} w-full h-full object-cover`}
        onError={() => {
          console.error("Image failed to load:", src);
          setImageError(true);
        }}
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        console.error("Next.js Image failed to load:", src);
        if (isLocalUpload) {
          // Try regular img tag as fallback for local uploads
          setImgFallback(true);
        } else {
          setImageError(true);
        }
      }}
      {...props}
    />
  );
}
