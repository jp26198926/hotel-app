/**
 * Color utility functions for dynamic theming
 */

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Generate lighter/darker variations of a color
 */
export function generateColorVariations(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return {};

  // Generate different shades
  const variations = {};

  // Very light (50, 100, 200)
  variations["50"] = `rgb(${Math.min(255, rgb.r + 200)}, ${Math.min(
    255,
    rgb.g + 200
  )}, ${Math.min(255, rgb.b + 200)})`;
  variations["100"] = `rgb(${Math.min(255, rgb.r + 150)}, ${Math.min(
    255,
    rgb.g + 150
  )}, ${Math.min(255, rgb.b + 150)})`;
  variations["200"] = `rgb(${Math.min(255, rgb.r + 100)}, ${Math.min(
    255,
    rgb.g + 100
  )}, ${Math.min(255, rgb.b + 100)})`;

  // Light (300, 400)
  variations["300"] = `rgb(${Math.min(255, rgb.r + 50)}, ${Math.min(
    255,
    rgb.g + 50
  )}, ${Math.min(255, rgb.b + 50)})`;
  variations["400"] = `rgb(${Math.min(255, rgb.r + 25)}, ${Math.min(
    255,
    rgb.g + 25
  )}, ${Math.min(255, rgb.b + 25)})`;

  // Base (500, 600)
  variations["500"] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  variations["600"] = `rgb(${Math.max(0, rgb.r - 25)}, ${Math.max(
    0,
    rgb.g - 25
  )}, ${Math.max(0, rgb.b - 25)})`;

  // Dark (700, 800, 900)
  variations["700"] = `rgb(${Math.max(0, rgb.r - 50)}, ${Math.max(
    0,
    rgb.g - 50
  )}, ${Math.max(0, rgb.b - 50)})`;
  variations["800"] = `rgb(${Math.max(0, rgb.r - 75)}, ${Math.max(
    0,
    rgb.g - 75
  )}, ${Math.max(0, rgb.b - 75)})`;
  variations["900"] = `rgb(${Math.max(0, rgb.r - 100)}, ${Math.max(
    0,
    rgb.g - 100
  )}, ${Math.max(0, rgb.b - 100)})`;

  return variations;
}

/**
 * Generate CSS variables for dynamic theming
 */
export function generateCSSVariables(primaryColor, secondaryColor) {
  const primaryVariations = generateColorVariations(primaryColor);
  const secondaryVariations = generateColorVariations(secondaryColor);

  const cssVars = {};

  // Primary color variations
  Object.entries(primaryVariations).forEach(([shade, color]) => {
    cssVars[`--color-primary-${shade}`] = color;
  });

  // Secondary color variations
  Object.entries(secondaryVariations).forEach(([shade, color]) => {
    cssVars[`--color-secondary-${shade}`] = color;
  });

  return cssVars;
}

/**
 * Apply CSS variables to document root
 */
export function applyDynamicColors(primaryColor, secondaryColor) {
  if (typeof window === "undefined") return;

  const cssVars = generateCSSVariables(primaryColor, secondaryColor);
  const root = document.documentElement;

  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Get dynamic color CSS class
 */
export function getDynamicColorClass(type, shade, property = "bg") {
  return `dynamic-${property}-${type}-${shade}`;
}
