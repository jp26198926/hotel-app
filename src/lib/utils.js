import bcrypt from "bcryptjs";
import { format, parseISO, isValid } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a password with its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: MMM dd, yyyy)
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatStr = "MMM dd, yyyy") {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) return "";

  return format(dateObj, formatStr);
}

/**
 * Format time to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted time string
 */
export function formatTime(date) {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) return "";

  return format(dateObj, "h:mm a");
}

/**
 * Calculate age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Generate a random ID
 * @param {number} length - Length of the ID (default: 8)
 * @returns {string} Random ID
 */
export function generateId(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
}

/**
 * Get room status color class
 * @param {string} status - Room status
 * @returns {string} Tailwind color class
 */
export function getRoomStatusColor(status) {
  const colors = {
    available: "bg-green-100 text-green-800",
    occupied: "bg-red-100 text-red-800",
    reserved: "bg-yellow-100 text-yellow-800",
    maintenance: "bg-gray-100 text-gray-800",
    cleaning: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Get booking status color class
 * @param {string} status - Booking status
 * @returns {string} Tailwind color class
 */
export function getBookingStatusColor(status) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    checkedIn: "bg-green-100 text-green-800",
    checkedOut: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    noShow: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Calculate booking total with taxes and fees
 * @param {number} baseAmount - Base booking amount
 * @param {number} taxRate - Tax rate (default: 0.1 for 10%)
 * @param {number} serviceCharge - Service charge (default: 0.05 for 5%)
 * @returns {Object} Breakdown of charges
 */
export function calculateBookingTotal(
  baseAmount,
  taxRate = 0.1,
  serviceCharge = 0.05
) {
  const tax = baseAmount * taxRate;
  const service = baseAmount * serviceCharge;
  const total = baseAmount + tax + service;

  return {
    baseAmount,
    tax,
    service,
    total,
  };
}

/**
 * Check if date is within business hours
 * @param {Date} date - Date to check
 * @param {Object} businessHours - Business hours config
 * @returns {boolean} True if within business hours
 */
export function isWithinBusinessHours(
  date,
  businessHours = { start: 6, end: 23 }
) {
  const hour = date.getHours();
  return hour >= businessHours.start && hour <= businessHours.end;
}
