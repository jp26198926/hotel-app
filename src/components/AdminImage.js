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
  ...props
}) {
  // Check if the image is a local upload or external
  const isLocalUpload = src && src.startsWith("/uploads/");

  if (isLocalUpload) {
    // For local uploads, use regular img tag to avoid Next.js optimization issues
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={onLoad}
        onError={onError}
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
