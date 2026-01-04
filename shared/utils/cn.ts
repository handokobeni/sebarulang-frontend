/**
 * cn (className) utility
 * Combines clsx and tailwind-merge for conditional classes
 */

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

