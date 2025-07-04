"use client";

import { useEffect } from "react";
import { useAdminSettings } from "@/context/AdminSettingsContext";
import { applyDynamicColors } from "@/lib/colorUtils";

export default function DynamicColorProvider({ children }) {
  const { appSettings, isLoading } = useAdminSettings();

  useEffect(() => {
    if (!isLoading && appSettings.primaryColor && appSettings.secondaryColor) {
      // Apply dynamic colors to CSS variables
      applyDynamicColors(appSettings.primaryColor, appSettings.secondaryColor);

      // Also inject dynamic CSS classes
      injectDynamicCSS(appSettings.primaryColor, appSettings.secondaryColor);
    }
  }, [appSettings.primaryColor, appSettings.secondaryColor, isLoading]);

  return <>{children}</>;
}

function injectDynamicCSS(primaryColor, secondaryColor) {
  if (typeof window === "undefined") return;

  // Remove existing dynamic styles
  const existingStyle = document.getElementById("dynamic-colors");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement("style");
  style.id = "dynamic-colors";

  // Generate CSS for primary and secondary colors
  const css = `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
    }
    
    /* Dynamic Button Styles */
    .btn-primary {
      background: linear-gradient(135deg, ${primaryColor}, ${darkenColor(
    primaryColor,
    15
  )}) !important;
      border-color: ${primaryColor} !important;
      color: white !important;
      box-shadow: 0 4px 6px -1px ${hexToRgba(primaryColor, 0.25)} !important;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, ${darkenColor(
        primaryColor,
        10
      )}, ${darkenColor(primaryColor, 25)}) !important;
      box-shadow: 0 6px 8px -1px ${hexToRgba(primaryColor, 0.35)} !important;
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: linear-gradient(135deg, ${secondaryColor}, ${darkenColor(
    secondaryColor,
    15
  )}) !important;
      border-color: ${secondaryColor} !important;
      color: white !important;
      box-shadow: 0 4px 6px -1px ${hexToRgba(secondaryColor, 0.25)} !important;
    }
    
    .btn-secondary:hover {
      background: linear-gradient(135deg, ${darkenColor(
        secondaryColor,
        10
      )}, ${darkenColor(secondaryColor, 25)}) !important;
      box-shadow: 0 6px 8px -1px ${hexToRgba(secondaryColor, 0.35)} !important;
      transform: translateY(-1px);
    }
    
    .btn-outline {
      border: 2px solid ${primaryColor} !important;
      color: ${primaryColor} !important;
      background: white !important;
    }
    
    .btn-outline:hover {
      background-color: ${lightenColor(primaryColor, 88)} !important;
      border-color: ${darkenColor(primaryColor, 10)} !important;
      color: ${darkenColor(primaryColor, 20)} !important;
    }
    
    .btn-ghost {
      color: ${primaryColor} !important;
      background: transparent !important;
    }
    
    .btn-ghost:hover {
      background-color: ${lightenColor(primaryColor, 88)} !important;
      color: ${darkenColor(primaryColor, 10)} !important;
    }
    
    /* Dynamic Badge Styles */
    .badge-primary {
      background-color: ${lightenColor(primaryColor, 80)} !important;
      color: ${darkenColor(primaryColor, 20)} !important;
    }
    
    .badge-secondary {
      background-color: ${lightenColor(secondaryColor, 80)} !important;
      color: ${darkenColor(secondaryColor, 20)} !important;
    }
    
    /* Dynamic Input Focus Styles */
    .input-focus:focus {
      border-color: ${primaryColor} !important;
      box-shadow: 0 0 0 3px ${lightenColor(primaryColor, 90)} !important;
    }
    
    /* Dynamic Link Styles */
    .link-primary {
      color: ${primaryColor} !important;
    }
    
    .link-primary:hover {
      color: ${darkenColor(primaryColor, 10)} !important;
    }
    
    /* Dynamic Tab Styles */
    .tab-active {
      background: linear-gradient(135deg, ${lightenColor(
        primaryColor,
        85
      )}, ${lightenColor(secondaryColor, 85)}) !important;
      color: ${darkenColor(primaryColor, 20)} !important;
      border-left: 4px solid ${primaryColor} !important;
      box-shadow: 0 2px 4px -1px ${hexToRgba(primaryColor, 0.15)} !important;
    }
    
    /* Dynamic Border Styles */
    .border-primary {
      border-color: ${primaryColor} !important;
    }
    
    .border-secondary {
      border-color: ${secondaryColor} !important;
    }
    
    /* Dynamic Background Styles */
    .bg-primary {
      background-color: ${primaryColor} !important;
    }
    
    .bg-secondary {
      background-color: ${secondaryColor} !important;
    }
    
    .bg-primary-light {
      background-color: ${lightenColor(primaryColor, 80)} !important;
    }
    
    .bg-secondary-light {
      background-color: ${lightenColor(secondaryColor, 80)} !important;
    }
    
    /* Dynamic Text Styles */
    .text-primary {
      color: ${primaryColor} !important;
    }
    
    .text-secondary {
      color: ${secondaryColor} !important;
    }
    
    /* Dynamic Gradient Styles */
    .gradient-primary {
      background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
    }
    
    .gradient-primary-light {
      background: linear-gradient(135deg, ${lightenColor(
        primaryColor,
        80
      )}, ${lightenColor(secondaryColor, 80)}) !important;
    }
    
    /* Override existing hardcoded styles with more specificity */
    .bg-red-700,
    .bg-red-600,
    .bg-red-500,
    .bg-red-100,
    .bg-red-50 {
      background-color: ${primaryColor} !important;
    }
    
    .bg-orange-600,
    .bg-orange-500,
    .bg-orange-400,
    .bg-orange-100,
    .bg-orange-50 {
      background-color: ${secondaryColor} !important;
    }
    
    .text-red-700,
    .text-red-600,
    .text-red-500,
    .text-red-800 {
      color: ${primaryColor} !important;
    }
    
    .text-orange-700,
    .text-orange-600,
    .text-orange-500,
    .text-orange-800 {
      color: ${secondaryColor} !important;
    }
    
    .border-red-700,
    .border-red-600,
    .border-red-500 {
      border-color: ${primaryColor} !important;
    }
    
    .border-orange-700,
    .border-orange-600,
    .border-orange-500 {
      border-color: ${secondaryColor} !important;
    }
    
    .border-l-red-600 {
      border-left-color: ${primaryColor} !important;
    }
    
    /* Light background variations */
    .bg-red-50,
    .bg-red-100 {
      background-color: ${lightenColor(primaryColor, 85)} !important;
    }
    
    .bg-orange-50,
    .bg-orange-100 {
      background-color: ${lightenColor(secondaryColor, 85)} !important;
    }
    
    /* Focus ring styles */
    .focus\\:ring-red-500:focus,
    .focus\\:ring-red-600:focus {
      --tw-ring-color: ${lightenColor(primaryColor, 70)} !important;
    }
    
    .focus\\:ring-orange-500:focus,
    .focus\\:ring-orange-600:focus {
      --tw-ring-color: ${lightenColor(secondaryColor, 70)} !important;
    }
    
    /* Hover styles */
    .hover\\:bg-red-50:hover,
    .hover\\:bg-red-100:hover {
      background-color: ${lightenColor(primaryColor, 85)} !important;
    }
    
    .hover\\:bg-orange-50:hover,
    .hover\\:bg-orange-100:hover {
      background-color: ${lightenColor(secondaryColor, 85)} !important;
    }
    
    /* Gradient button overrides with higher specificity */
    .bg-gradient-to-r.from-red-700.to-orange-600,
    .bg-gradient-to-r.from-red-800.to-orange-700 {
      background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
      box-shadow: 0 4px 6px -1px ${hexToRgba(primaryColor, 0.25)} !important;
    }
    
    .hover\\:from-red-800:hover.hover\\:to-orange-700:hover,
    .hover\\:from-red-900:hover.hover\\:to-orange-800:hover {
      background: linear-gradient(135deg, ${darkenColor(
        primaryColor,
        15
      )}, ${darkenColor(secondaryColor, 15)}) !important;
      box-shadow: 0 6px 8px -1px ${hexToRgba(primaryColor, 0.35)} !important;
      transform: translateY(-1px);
    }
    
    .bg-gradient-to-r.from-orange-500.to-orange-400 {
      background: linear-gradient(135deg, ${secondaryColor}, ${lightenColor(
    secondaryColor,
    10
  )}) !important;
    }
    
    .hover\\:from-orange-600:hover.hover\\:to-orange-500:hover {
      background: linear-gradient(135deg, ${darkenColor(
        secondaryColor,
        10
      )}, ${secondaryColor}) !important;
    }
    
    .bg-gradient-to-r.from-orange-300.to-orange-200 {
      background: linear-gradient(135deg, ${lightenColor(
        secondaryColor,
        40
      )}, ${lightenColor(secondaryColor, 60)}) !important;
    }
    
    .hover\\:from-orange-400:hover.hover\\:to-orange-300:hover {
      background: linear-gradient(135deg, ${lightenColor(
        secondaryColor,
        20
      )}, ${lightenColor(secondaryColor, 40)}) !important;
    }
    
    /* Override gradient backgrounds in admin tabs */
    .bg-gradient-to-r.from-red-50.to-orange-50 {
      background: linear-gradient(135deg, ${lightenColor(
        primaryColor,
        88
      )}, ${lightenColor(secondaryColor, 88)}) !important;
    }
    
    /* Header gradient */
    .bg-gradient-to-br.from-red-600.to-orange-500 {
      background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}) !important;
    }
    
    /* Border left colors */
    .border-l-4.border-red-600 {
      border-left-color: ${primaryColor} !important;
    }
    
    /* Category badge colors */
    .bg-red-500 {
      background-color: ${primaryColor} !important;
    }
    
    .bg-orange-500 {
      background-color: ${secondaryColor} !important;
    }
    
    .bg-red-400 {
      background-color: ${lightenColor(primaryColor, 15)} !important;
    }
    
    .bg-orange-400 {
      background-color: ${lightenColor(secondaryColor, 15)} !important;
    }
    
    .bg-red-600 {
      background-color: ${darkenColor(primaryColor, 10)} !important;
    }
    
    .bg-orange-600 {
      background-color: ${darkenColor(secondaryColor, 10)} !important;
    }
    
    .bg-red-700 {
      background-color: ${darkenColor(primaryColor, 20)} !important;
    }
    
    .bg-orange-700 {
      background-color: ${darkenColor(secondaryColor, 20)} !important;
    }
    
    /* Comprehensive color overrides for hotel theme */
    
    /* View mode buttons */
    .bg-red-100.text-red-700 {
      background-color: ${lightenColor(primaryColor, 85)} !important;
      color: ${darkenColor(primaryColor, 20)} !important;
    }
    
    /* Focus rings and input styles */
    .focus\\:ring-red-500:focus {
      --tw-ring-color: ${hexToRgba(primaryColor, 0.5)} !important;
      border-color: ${primaryColor} !important;
    }
    
    .input-focus:focus {
      border-color: ${primaryColor} !important;
      --tw-ring-color: ${hexToRgba(primaryColor, 0.3)} !important;
      box-shadow: 0 0 0 3px ${hexToRgba(primaryColor, 0.1)} !important;
    }
    
    /* Status badges and indicators */
    .bg-green-100.text-green-800 {
      background-color: ${lightenColor(primaryColor, 75)} !important;
      color: ${darkenColor(primaryColor, 15)} !important;
    }
    
    /* Category indicators */
    .w-2.h-2.rounded-full.bg-red-500,
    .w-2.h-2.rounded-full.bg-orange-500,
    .w-2.h-2.rounded-full.bg-red-600,
    .w-2.h-2.rounded-full.bg-orange-600,
    .w-2.h-2.rounded-full.bg-red-400,
    .w-2.h-2.rounded-full.bg-orange-400,
    .w-2.h-2.rounded-full.bg-red-700 {
      background-color: ${primaryColor} !important;
    }
    
    /* Card feature backgrounds */
    .bg-gradient-to-br.from-blue-50.to-purple-50,
    .bg-gradient-to-br.from-red-50.to-orange-50,
    .bg-gradient-to-br.from-orange-50.to-red-50,
    .bg-gradient-to-br.from-yellow-50.to-orange-50,
    .bg-gradient-to-br.from-red-50.to-pink-50 {
      background: linear-gradient(135deg, ${lightenColor(
        primaryColor,
        88
      )}, ${lightenColor(secondaryColor, 88)}) !important;
    }
    
    /* Hover effects */
    .hover\\:bg-gray-50:hover {
      background-color: ${lightenColor(primaryColor, 92)} !important;
    }
    
    .hover\\:text-gray-900:hover {
      color: ${darkenColor(primaryColor, 30)} !important;
    }
    
    /* Border colors for cards and inputs */
    .border-gray-200 {
      border-color: ${lightenColor(primaryColor, 80)} !important;
    }
    
    .border-gray-300 {
      border-color: ${lightenColor(primaryColor, 70)} !important;
    }
    
    /* Shadows with brand color tint */
    .shadow-sm {
      box-shadow: 0 1px 2px 0 ${hexToRgba(primaryColor, 0.05)} !important;
    }
    
    .shadow-lg {
      box-shadow: 0 10px 15px -3px ${hexToRgba(
        primaryColor,
        0.1
      )}, 0 4px 6px -2px ${hexToRgba(primaryColor, 0.05)} !important;
    }
    
    .shadow-xl {
      box-shadow: 0 20px 25px -5px ${hexToRgba(
        primaryColor,
        0.1
      )}, 0 10px 10px -5px ${hexToRgba(primaryColor, 0.04)} !important;
    }
    
    /* Hotel-specific warm color palette */
    .text-warm-primary {
      color: ${primaryColor} !important;
    }
    
    .text-warm-secondary {
      color: ${secondaryColor} !important;
    }
    
    .bg-warm-primary {
      background-color: ${primaryColor} !important;
    }
    
    .bg-warm-secondary {
      background-color: ${secondaryColor} !important;
    }
    
    .border-warm-primary {
      border-color: ${primaryColor} !important;
    }
    
    .border-warm-secondary {
      border-color: ${secondaryColor} !important;
    }
    
    /* Responsive gradient effects */
    @media (min-width: 768px) {
      .btn-primary:hover,
      .btn-secondary:hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
    }
    
    /* High contrast for accessibility */
    @media (prefers-contrast: high) {
      .btn-primary,
      .btn-secondary {
        border: 2px solid ${darkenColor(primaryColor, 30)} !important;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .btn-primary:hover,
      .btn-secondary:hover,
      .tab-active {
        transform: none !important;
        transition: none !important;
      }
    }
  `;

  style.textContent = css;
  document.head.appendChild(style);
}

// Helper functions to lighten/darken colors
function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Convert hex to rgba with alpha
function hexToRgba(hex, alpha = 1) {
  const num = parseInt(hex.replace("#", ""), 16);
  const R = num >> 16;
  const G = (num >> 8) & 0x00ff;
  const B = num & 0x0000ff;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}
