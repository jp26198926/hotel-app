/**
 * Hotel color theme utilities
 * Based on the actual hotel interior design colors
 */

// Default hotel colors extracted from the interior images
export const HOTEL_COLORS = {
  primary: "#D4A574", // Warm golden/amber from ceiling and lighting
  secondary: "#8B4513", // Rich brown/chocolate from furniture and accents
  neutral: {
    light: "#F7F3E9", // Warm light background
    medium: "#E5D5B7", // Warm medium tone
    dark: "#4A3728", // Warm dark brown
  },
  accent: {
    gold: "#F4E4BC", // Light gold
    copper: "#B08D57", // Copper tone
    bronze: "#8C7853", // Bronze accent
  },
};

/**
 * Get CSS custom properties for hotel colors
 */
export function getHotelColorVariables() {
  return {
    "--hotel-primary": HOTEL_COLORS.primary,
    "--hotel-secondary": HOTEL_COLORS.secondary,
    "--hotel-neutral-light": HOTEL_COLORS.neutral.light,
    "--hotel-neutral-medium": HOTEL_COLORS.neutral.medium,
    "--hotel-neutral-dark": HOTEL_COLORS.neutral.dark,
    "--hotel-accent-gold": HOTEL_COLORS.accent.gold,
    "--hotel-accent-copper": HOTEL_COLORS.accent.copper,
    "--hotel-accent-bronze": HOTEL_COLORS.accent.bronze,
  };
}

/**
 * Hotel-themed CSS classes
 */
export const HOTEL_CLASSES = {
  // Background classes
  bgPrimary: "bg-warm-primary",
  bgSecondary: "bg-warm-secondary",
  bgGradient: "bg-gradient-to-br from-warm-primary to-warm-secondary",

  // Text classes
  textPrimary: "text-warm-primary",
  textSecondary: "text-warm-secondary",

  // Border classes
  borderPrimary: "border-warm-primary",
  borderSecondary: "border-warm-secondary",

  // Button classes
  btnPrimary: "btn-primary",
  btnSecondary: "btn-secondary",
  btnOutline: "btn-outline",
  btnGhost: "btn-ghost",

  // Badge classes
  badgePrimary: "badge-primary",
  badgeSecondary: "badge-secondary",
};

/**
 * Generate hotel-themed gradient
 */
export function createHotelGradient(direction = "135deg", opacity = 1) {
  const primary =
    HOTEL_COLORS.primary +
    Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");
  const secondary =
    HOTEL_COLORS.secondary +
    Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0");

  return `linear-gradient(${direction}, ${primary}, ${secondary})`;
}

/**
 * Generate hotel color with opacity
 */
export function createHotelColor(type = "primary", opacity = 1) {
  const color =
    type === "primary" ? HOTEL_COLORS.primary : HOTEL_COLORS.secondary;
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return color + alpha;
}

/**
 * Hotel-themed shadow
 */
export function createHotelShadow(intensity = "medium") {
  const shadows = {
    light: `0 1px 3px 0 ${HOTEL_COLORS.primary}20`,
    medium: `0 4px 6px -1px ${HOTEL_COLORS.primary}25, 0 2px 4px -1px ${HOTEL_COLORS.primary}15`,
    heavy: `0 10px 15px -3px ${HOTEL_COLORS.primary}25, 0 4px 6px -2px ${HOTEL_COLORS.primary}15`,
  };

  return shadows[intensity] || shadows.medium;
}

/**
 * Apply hotel theme to an element
 */
export function applyHotelTheme(element, options = {}) {
  if (typeof window === "undefined" || !element) return;

  const {
    background = false,
    text = false,
    border = false,
    shadow = false,
  } = options;

  if (background) {
    element.style.background = createHotelGradient();
  }

  if (text) {
    element.style.color = HOTEL_COLORS.primary;
  }

  if (border) {
    element.style.borderColor = HOTEL_COLORS.primary;
  }

  if (shadow) {
    element.style.boxShadow = createHotelShadow(shadow);
  }
}
