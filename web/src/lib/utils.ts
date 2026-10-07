import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseData<T = unknown>(input: unknown): T[] {
  // Case 1: đã là array → dùng luôn
  if (Array.isArray(input)) return input as T[];

  // Case 2: không phải string → reject
  if (typeof input !== "string") return [];

  try {
    // Fix HTML encoded string từ MDX
    const cleaned = input
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    const parsed: unknown = JSON.parse(cleaned);

    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch (err) {
    console.error("❌ parseChartData error:", err);
    return [];
  }
}
