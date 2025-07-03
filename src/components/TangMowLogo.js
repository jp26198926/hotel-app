"use client";

import Image from "next/image";

export default function TangMowLogo({
  width = 120,
  height = 45,
  className = "",
  showText = false,
  textClassName = "text-xl font-bold text-gray-800",
  variant = "full", // "full", "compact", or "icon"
  priority = false,
}) {
  const getLogoSrc = () => {
    if (variant === "compact") return "/tang-mow-logo-compact.svg";
    if (variant === "icon") return "/tang-mow-logo.svg";
    return "/tang-mow-logo-full.svg";
  };

  const getLogoSize = () => {
    if (variant === "compact")
      return { width: Math.min(width, 120), height: Math.min(height, 40) };
    if (variant === "icon")
      return { width: Math.min(width, 160), height: Math.min(height, 60) };
    return { width: Math.min(width, 200), height: Math.min(height, 80) };
  };

  const logoSize = getLogoSize();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src={getLogoSrc()}
          alt="Tang Mow Limited"
          width={logoSize.width}
          height={logoSize.height}
          className={`w-auto ${
            variant === "compact" ? "h-8" : variant === "icon" ? "h-10" : "h-12"
          }`}
          priority={priority}
        />
      </div>
      {showText && <span className={textClassName}>Tang Mow</span>}
    </div>
  );
}
