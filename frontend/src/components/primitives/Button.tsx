import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-surface shadow-btn hover:bg-zinc-800 active:translate-y-px active:bg-zinc-900",
  secondary: "border border-line bg-surface text-ink shadow-btn hover:bg-hover",
  ghost: "text-ink-2 hover:bg-hover hover:text-ink",
  danger: "bg-danger text-surface hover:bg-danger-strong",
};

const SIZES: Record<Size, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
};

/** Primary action primitive. Restrained per Tokey visual north star. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, icon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "tk-num inline-flex items-center justify-center gap-1.5 rounded-control font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
});
