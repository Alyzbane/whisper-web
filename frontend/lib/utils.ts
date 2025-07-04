import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a file size in bytes to a human-readable string.
 * 
 * @param bytes  - The size of the file in bytes.
 * @param decimalPoint - Optional number of decimal places to include in the formatted string. Defaults to 2.
 * @returns A string representing the file size in a human-readable format, e.g., "1.23 MB". 
 */
export function formatFileSize(bytes: number, decimalPoint?: number): string {
  if (bytes == 0) return '0 Bytes';
  let k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}