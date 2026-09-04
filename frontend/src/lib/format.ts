/**
 * Formatting helpers. Financial rule: ALL money math is integer micros.
 * Display formatting uses integer division only — no floating-point arithmetic
 * on financial values (Tokey Core requirement mirrored here).
 */

const MICRO = 1_000_000;

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
};

function splitMicros(micros: number): { sign: string; whole: string; frac: string } {
  const negative = micros < 0;
  const abs = Math.abs(Math.trunc(micros));
  const whole = Math.trunc(abs / MICRO);
  const frac = String(abs % MICRO).padStart(6, "0");
  return {
    sign: negative ? "-" : "",
    whole: whole.toLocaleString("en-US"),
    frac,
  };
}

/** "$1,234.50" / "₹1,799.00" / "1,234.50 XAU" — display only, integer math. */
export function formatMoney(micros: number, currency = "USD", opts?: { decimals?: number }): string {
  const { sign, whole, frac } = splitMicros(micros);
  const decimals = Math.min(Math.max(opts?.decimals ?? 2, 0), 6);
  const fracPart = decimals === 0 ? "" : "." + frac.slice(0, decimals);
  const symbol = CURRENCY_SYMBOLS[currency];
  if (symbol) return `${sign}${symbol}${whole}${fracPart}`;
  return `${sign}${whole}${fracPart} ${currency}`;
}

/** Full precision, trailing zeros trimmed: "$0.000001". */
export function formatMoneyExact(micros: number, currency = "USD"): string {
  const { sign, whole, frac } = splitMicros(micros);
  const trimmed = frac.replace(/0+$/, "");
  const symbol = CURRENCY_SYMBOLS[currency];
  const num = trimmed ? `${whole}.${trimmed}` : whole;
  if (symbol) return `${sign}${symbol}${num}`;
  return `${sign}${num} ${currency}`;
}

/** "12,000" — bare number with separators (for meter legends). */
export function formatNumber(value: number): string {
  return Math.trunc(value).toLocaleString("en-US");
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function timeAgo(iso: string | number | null | undefined): string {
  if (iso === null || iso === undefined) return "—";
  const t = typeof iso === "number" ? iso : new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function truncateMiddle(value: string, head = 12, tail = 8): string {
  if (!value) return "";
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function humanizeCode(code: string): string {
  return code
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural ?? singular + "s"}`;
}
