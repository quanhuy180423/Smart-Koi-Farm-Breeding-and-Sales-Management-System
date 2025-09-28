/**
 * Format a number to Vietnamese currency (VND)
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export interface FormatCurrencyOptions {
  /** Show currency symbol (default: true) */
  showSymbol?: boolean;
  /** Locale for formatting (default: 'vi-VN') */
  locale?: string;
  /** Currency code (default: 'VND') */
  currency?: string;
  /** Minimum fraction digits (default: 0) */
  minimumFractionDigits?: number;
  /** Maximum fraction digits (default: 0) */
  maximumFractionDigits?: number;
}

export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    showSymbol = true,
    locale = "vi-VN",
    currency = "VND",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  try {
    if (showSymbol) {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount);
    } else {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(amount);
    }
  } catch (error) {
    console.error("Error formatting currency:", error);
    return amount.toString();
  }
}

/**
 * Format currency with short notation (K, M, B)
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string with short notation
 */
export function formatCurrencyShort(
  amount: number,
  options: Omit<
    FormatCurrencyOptions,
    "minimumFractionDigits" | "maximumFractionDigits"
  > = {}
): string {
  const { showSymbol = true, locale = "vi-VN", currency = "VND" } = options;

  const formatShort = (num: number, suffix: string): string => {
    const formatted = formatCurrency(num, {
      showSymbol,
      locale,
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });

    if (showSymbol) {
      // Replace VND with suffix + VND
      return formatted.replace(" ₫", `${suffix} ₫`);
    } else {
      return `${formatted}${suffix}`;
    }
  };

  if (amount >= 1_000_000_000) {
    return formatShort(amount / 1_000_000_000, "B");
  } else if (amount >= 1_000_000) {
    return formatShort(amount / 1_000_000, "M");
  } else if (amount >= 1_000) {
    return formatShort(amount / 1_000, "K");
  } else {
    return formatCurrency(amount, options);
  }
}

/**
 * Parse a formatted currency string back to number
 * @param currencyString - The formatted currency string
 * @returns Parsed number or NaN if parsing fails
 */
export function parseCurrency(currencyString: string): number {
  try {
    // Remove currency symbols and spaces
    const cleanString = currencyString
      .replace(/[₫\$€£¥]/g, "") // Remove currency symbols
      .replace(/\s/g, "") // Remove spaces
      .replace(/\./g, "") // Remove thousand separators (dots in Vietnamese)
      .replace(/,/g, "."); // Replace comma with dot for decimal

    return parseFloat(cleanString) || 0;
  } catch (error) {
    console.error("Error parsing currency:", error);
    return NaN;
  }
}

// Export default formatCurrency function
export default formatCurrency;
