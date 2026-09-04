import { type Authority } from "../../lib/types";
import { formatMoney } from "../../lib/format";
import { cn } from "../../lib/cn";

interface AuthorityMeterProps {
  authority: Authority;
  compact?: boolean;
}

/**
 * Tokey Authority Meter. Visualizes the partition of granted funds:
 * Granted = Reserved + Available. This is a signature Tokey component — not
 * a generic progress bar.
 */
export function AuthorityMeter({ authority, compact = false }: AuthorityMeterProps) {
  const { balance_micros, reserved_micros, available_micros, currency } = authority;
  const total = Math.max(balance_micros, 1);
  const reservedPct = Math.min(100, (reserved_micros / total) * 100);
  const availablePct = Math.min(100, (available_micros / total) * 100);

  return (
    <div className={cn("space-y-2", compact ? "" : "w-full")}>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-sunken">
        <div className="bg-warn transition-all" style={{ width: `${reservedPct}%` }} title={`Reserved ${formatMoney(reserved_micros, currency)}`} />
        <div className="bg-ok transition-all" style={{ width: `${availablePct}%` }} title={`Available ${formatMoney(available_micros, currency)}`} />
      </div>
      <div className="tk-num flex items-center justify-between text-[10px] text-ink-faint">
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-warn" /> Reserved {formatMoney(reserved_micros, currency)}</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-ok" /> Available {formatMoney(available_micros, currency)}</span>
        <span>Granted {formatMoney(balance_micros, currency)}</span>
      </div>
    </div>
  );
}
