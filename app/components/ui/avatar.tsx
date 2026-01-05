"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn } from "./utils";

// Custom Avatar component tanpa Radix UI - tidak menggunakan inline styles
interface AvatarProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
}

interface AvatarImageProps extends React.ComponentProps<"img"> {}

interface AvatarFallbackProps extends React.ComponentProps<"div"> {
  children?: React.ReactNode;
}

function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <img
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {children || <User className="size-4" />}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback };

