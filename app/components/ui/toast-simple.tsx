"use client";

import * as React from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "./utils";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Simple toast implementation tanpa inline styles - semua via CSS classes
const ToastContext = React.createContext<{
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Set global toast store for backward compatibility
  React.useEffect(() => {
    setToastStore({ toasts, addToast, removeToast });
  }, [toasts, addToast, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function useToastContext() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

// Export hook
export function useToast() {
  return useToastContext();
}

// Toast container - positioned via CSS classes, no inline styles
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: AlertCircle,
  };

  const Icon = icons[toast.type];

  return (
    <div className={cn("toast-item", `toast-item-${toast.type}`)}>
      <Icon className="toast-icon" />
      <span className="toast-message">{toast.message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={() => onRemove(toast.id)}
        aria-label="Close"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

// Global toast store untuk backward compatibility
let toastStore: {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
} | null = null;

export function setToastStore(store: {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}) {
  toastStore = store;
}

export const toast = {
  success: (message: string) => {
    if (toastStore) {
      toastStore.addToast(message, "success");
    } else {
      console.warn("Toast store not initialized");
    }
  },
  error: (message: string) => {
    if (toastStore) {
      toastStore.addToast(message, "error");
    } else {
      console.warn("Toast store not initialized");
    }
  },
  info: (message: string) => {
    if (toastStore) {
      toastStore.addToast(message, "info");
    } else {
      console.warn("Toast store not initialized");
    }
  },
};

