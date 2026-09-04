import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "neutral" | "ok" | "warn" | "danger" | "info" | "mystery";
type Size = "sm" | "md";

interface BadgeProps {
  tone?: Tone;
  size?: Size;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

const TONES: Record<Tone, string> = {
  neutral: "bg-sunken text-ink-soft border-line",
  ok: "bg-ok-soft text-ok-strong border-transparent",
  warn: "bg-warn-soft text-warn-strong border-transparent",
  danger: "bg-danger-soft text-danger-strong border-transparent",
  info: "bg-info-soft text-info-strong border-transparent",
  mystery: "bg-mystery-soft text-mystery-strong border-transparent",
};

const DOT_COLORS: Record<Tone, string> = {
  neutral: "bg-ink-ghost",
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
  info: "bg-info",
  mystery: "bg-mystery",
};

const SIZES: Record<Size, string> = {
  sm: "text-2xs px-1.5 py-0",
  md: "text-xs px-2 py-0.5",
};

/** Status/facet badge. Numeric-friendly via tk-num. */
export function Badge({ tone = "neutral", size = "sm", dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "tk-num inline-flex items-center gap-1 rounded-full border font-medium",
        TONES[tone],
        SIZES[size],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOT_COLORS[tone])} />}
      {children}
    </span>
  );
}
