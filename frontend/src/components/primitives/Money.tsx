import { formatMoney, formatMoneyExact } from "../../lib/format";
import { cn } from "../../lib/cn";

interface MoneyProps {
  micros: number;
  currency?: string;
  exact?: boolean;
  className?: string;
  signed?: boolean;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "ok" | "danger" | "muted" | "warn";
}

const SIZES = { sm: "text-sm", md: "text-base", lg: "text-xl" };
const TONES = {
  default: "text-ink",
  ok: "text-ok",
  danger: "text-danger",
  muted: "text-ink-soft",
  warn: "text-warn",
};

/**
 * Money component. Integer-micro formatting only — no floating-point arithmetic
 * on the displayed value. Signed variants for debits/credits.
 */
export function Money({
  micros,
  currency = "USD",
  exact = false,
  className,
  signed = false,
  size = "md",
  tone = "default",
}: MoneyProps) {
  const text = exact ? formatMoneyExact(micros, currency) : formatMoney(micros, currency);
  const display = signed && micros > 0 ? `+${text}` : text;
  return (
    <span className={cn("tk-num font-medium tabular-nums", SIZES[size], TONES[tone], className)}>
      {display}
    </span>
  );
}
