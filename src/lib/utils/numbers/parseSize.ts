/**
 * Parse size string from KoiFishResponse to get the centimeter value
 * Input format: "11.2 inch / 28.5 cm"
 * Output: 28.5
 * @param sizeString - The size string from API response
 * @returns The size in centimeters as a number, or 0 if unable to parse
 */
export function parseSizeToNumber(
  sizeString: string | null | undefined,
): number {
  if (!sizeString) {
    return 0;
  }

  // Extract the cm value from format "11.2 inch / 28.5 cm"
  // Try to find "/ " followed by a number and " cm"
  const cmMatch = sizeString.match(/\/\s*([\d.]+)\s*cm/i);

  if (cmMatch && cmMatch[1]) {
    const parsed = parseFloat(cmMatch[1]);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Fallback: Try to parse the string as a direct number
  const directNumber = parseFloat(sizeString);
  return isNaN(directNumber) ? 0 : directNumber;
}
