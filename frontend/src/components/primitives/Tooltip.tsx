import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-2xs text-surface opacity-0 shadow-pop transition-opacity group-hover:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-1 -translate-x-1/2",
          side === "bottom" && "top-full left-1/2 mt-1 -translate-x-1/2",
        )}
      >
        {content}
      </span>
    </span>
  );
}
