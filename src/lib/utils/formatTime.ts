/**
 * Format time from "HH:MM:SS" format to "HH:MM"
 * @param time - Time in "HH:MM:SS" format (e.g., "06:00:00")
 * @returns Formatted time as "HH:MM" (e.g., "06:00")
 */
export const formatTimeToHHMM = (time: string): string => {
  if (!time) return "";
  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
};

/**
 * Format time from "HH:MM:SS" or "HH:MM" format to display
 * @param time - Time string in "HH:MM:SS" or "HH:MM" format
 * @returns Formatted time string
 */
export const formatTimeDisplay = (time: string): string => {
  if (!time) return "";
  const hhmm = formatTimeToHHMM(time);
  const [hours, minutes] = hhmm.split(":");

  return `${hours}:${minutes}`;
};
