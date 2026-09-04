import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps {
  className?: string;
  children: ReactNode;
  padding?: "none" | "sm" | "md";
  onClick?: () => void;
}

const PADDING = { none: "", sm: "p-3", md: "p-4" };

/** Beautiful UI surface primitive — quiet, elevated, and dense without chrome. */
export function Card({ className, children, padding = "md", onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface shadow-card",
        PADDING[padding],
        onClick && "cursor-pointer transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:bg-hover hover:shadow-raised",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
      </div>
      {action}
    </div>
  );
}
