"use client";

// Re-export toast components - menggunakan custom toast tanpa inline styles
export { ToastProvider, useToast, toast, setToastStore } from "./toast-simple";
export type { ToastType } from "./toast-simple";

// Dummy Toaster component untuk backward compatibility
export function Toaster() {
  return null; // Toast rendering handled by ToastProvider
}
