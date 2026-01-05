"use client";

/**
 * Dropdown Menu Component
 * Simple dropdown menu tanpa Radix UI - menggunakan Tailwind CSS
 * Follows .cursorrules: no inline styles, TypeScript interfaces, Tailwind CSS
 */

import * as React from "react";
import { cn } from "./utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  children,
  trigger,
  align = "right",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <div onClick={() => setOpen(!open)} className="cursor-pointer">{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
}: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px] flex items-center",
        className
      )}
    >
      {children}
    </div>
  );
}

