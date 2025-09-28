import { parseISO, isValid, format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format date utilities for the application using date-fns
 */

/**
 * Format a date string with specified format
 * @param dateString - Date string (ISO format preferred)
 * @param formatStr - Format string (date-fns format tokens)
 * @returns Formatted date string or 'N/A' if invalid
 */
export function formatDate(
  dateString?: string,
  formatStr: string = "PPP"
): string {
  if (!dateString) return "N/A";

  try {
    const date = parseISO(dateString);

    if (isValid(date)) {
      return format(date, formatStr, { locale: vi });
    }

    return "N/A";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}

/**
 * Format date for form inputs with custom format
 * @param dateString - Date string (ISO format preferred)
 * @param formatStr - Format string (default: 'yyyy-MM-dd')
 * @returns Date string in specified format or empty string if invalid
 */
export function formatDateForInput(
  dateString?: string,
  formatStr: string = "yyyy-MM-dd"
): string {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);

    if (isValid(date)) {
      return format(date, formatStr);
    }

    return "";
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
}

/**
 * Common date format presets using date-fns format tokens
 */
export const DATE_FORMATS = {
  // Full formats
  FULL_DATETIME: "EEEE, dd MMMM yyyy, HH:mm", // Thứ hai, 15 tháng 1 năm 2024, 14:30
  LONG_DATE: "dd MMMM yyyy", // 15 tháng 1 năm 2024
  MEDIUM_DATE: "dd/MM/yyyy", // 15/01/2024
  SHORT_DATE: "dd/MM/yy", // 15/01/24

  // Time formats
  TIME_24H: "HH:mm", // 14:30
  TIME_12H: "h:mm a", // 2:30 PM

  // Combined formats
  DATETIME_24H: "dd/MM/yyyy, HH:mm", // 15/01/2024, 14:30
  DATETIME_12H: "dd/MM/yyyy, h:mm a", // 15/01/2024, 2:30 PM

  // Form inputs
  INPUT_DATE: "yyyy-MM-dd", // 2024-01-15
  INPUT_DATETIME: "yyyy-MM-dd'T'HH:mm", // 2024-01-15T14:30

  // Vietnamese long format (compatible with old function)
  VIETNAMESE_LONG: "dd MMMM yyyy", // 15 tháng 1 năm 2024
} as const;

/**
 * Predefined format functions for common use cases
 */
export const formatters = {
  /**
   * Format date for display (Vietnamese long format - compatible with old function)
   */
  display: (dateString?: string) =>
    formatDate(dateString, DATE_FORMATS.VIETNAMESE_LONG),

  /**
   * Format date for form inputs
   */
  input: (dateString?: string) =>
    formatDateForInput(dateString, DATE_FORMATS.INPUT_DATE),

  /**
   * Format datetime for display
   */
  datetime: (dateString?: string) =>
    formatDate(dateString, DATE_FORMATS.DATETIME_24H),

  /**
   * Format time only
   */
  time: (dateString?: string) => formatDate(dateString, DATE_FORMATS.TIME_24H),

  /**
   * Format short date
   */
  short: (dateString?: string) =>
    formatDate(dateString, DATE_FORMATS.MEDIUM_DATE),

  /**
   * Format full date with day name
   */
  full: (dateString?: string) =>
    formatDate(dateString, DATE_FORMATS.FULL_DATETIME),
};

export default formatDate;
