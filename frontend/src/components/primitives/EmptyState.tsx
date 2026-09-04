import { type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Empty state — legible, calm, never decorative-gimmicky. */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center", className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-sunken text-ink-faint">
        {icon ?? <Search className="h-5 w-5" />}
      </div>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-ink-faint">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
