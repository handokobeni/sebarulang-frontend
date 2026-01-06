"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "./utils";

// Custom Dialog component tanpa Radix UI - tidak menggunakan inline styles
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  onOpenChange: (open: boolean) => void;
} | null>(null);

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.classList.add("dialog-open");
    } else {
      document.body.classList.remove("dialog-open");
    }
    return () => {
      document.body.classList.remove("dialog-open");
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div data-slot="dialog-root" className="fixed inset-0 z-50">
        {children}
      </div>
    </DialogContext.Provider>
  );
}

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("DialogContent must be used within Dialog");
  }
  return context;
}

function DialogOverlay({ onClick }: { onClick?: () => void }) {
  return (
    <div
      data-slot="dialog-overlay"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

function DialogContent({ className, children, onClose, ...props }: DialogContentProps) {
  const context = useDialogContext();
  const handleClose = onClose || (() => context.onOpenChange(false));

  return (
    <>
      <DialogOverlay onClick={handleClose} />
      <div
        data-slot="dialog-content"
        className={cn(
          // Mobile: bottom sheet style, Desktop: centered
          "fixed z-50 grid w-full gap-4 rounded-t-lg sm:rounded-lg border bg-background shadow-lg",
          // Mobile positioning (bottom sheet)
          "bottom-0 left-0 right-0 max-h-[90vh]",
          // Desktop positioning (centered)
          "sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:max-h-[85vh]",
          // Padding responsive
          "p-4 sm:p-6",
          className,
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          data-slot="dialog-close"
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col space-y-1.5 text-left", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};

