import Image from "next/image";

/**
 * Custom Image Component for Hotel Admin
 * Handles both local uploads and external images
 */
export default function AdminImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  width,
  height,
  ...props
}) {
  // Check if the image is a local upload or external
  const isLocalUpload = src && src.startsWith("/uploads/");

  if (isLocalUpload) {
    // For local uploads, use Next.js Image with unoptimized to avoid optimization issues
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        onLoad={onLoad}
        onError={onError}
        width={width || 300}
        height={height || 200}
        unoptimized
        {...props}
      />
    );
  }

  // For external images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onLoad={onLoad}
      onError={onError}
      fill
      style={{ objectFit: "cover" }}
      {...props}
    />
  );
}
