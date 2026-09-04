import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

/** Subtle skeleton shimmer. No glow — per quality filter. */
export function Skeleton({ className, lines = 1 }: SkeletonProps) {
  if (lines <= 1) return <div className={cn("tk-skeleton h-4 w-full", className)} />;
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="tk-skeleton h-4" style={{ width: `${70 + ((i * 17) % 30)}%` }} />
      ))}
    </div>
  );
}
