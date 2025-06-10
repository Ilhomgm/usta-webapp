// components/ui/badge.tsx
import React from "react";
import classNames from "classnames";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={classNames("inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800", className)}>
      {children}
    </span>
  );
}
