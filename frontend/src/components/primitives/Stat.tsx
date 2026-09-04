import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface StatProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: "up" | "down" | "flat";
  tone?: "ok" | "warn" | "danger" | "neutral";
  className?: string;
}

/** Compact KPI tile. Dense financial presentation. */
export function Stat({ label, value, hint, trend, tone = "neutral", className }: StatProps) {
  const trendColor =
    trend === "up" ? "text-ok" : trend === "down" ? "text-danger" : "text-ink-faint";
  const trendSymbol = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  const valueTone =
    tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : tone === "danger" ? "text-danger" : "text-ink";
  return (
    <div className={cn("rounded-card border border-line bg-surface p-3 shadow-card", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-soft">{label}</span>
        {trend && <span className={cn("tk-num text-[10px]", trendColor)}>{trendSymbol}</span>}
      </div>
      <div className={cn("tk-num mt-1 text-lg font-semibold tracking-tight", valueTone)}>{value}</div>
      {hint && <div className="tk-num mt-0.5 text-xs text-ink-faint">{hint}</div>}
    </div>
  );
}
