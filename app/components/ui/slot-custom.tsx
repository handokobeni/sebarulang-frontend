import * as React from "react";

// Custom Slot component tanpa Radix UI - simple polymorphic component
// Tidak menggunakan inline styles
interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  asChild?: boolean;
}

function Slot({ asChild, children, ...props }: SlotProps) {
  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const mergedProps = {
      ...childProps,
      ...props,
      className: `${props.className || ""} ${childProps.className || ""}`.trim(),
    };
    return React.cloneElement(children, mergedProps);
  }

  return <div {...props}>{children}</div>;
}

export { Slot };

