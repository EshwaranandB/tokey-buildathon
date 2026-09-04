import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

/** Text input. Restrained styling — no glow, no giant borders. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "tk-num w-full rounded-md border bg-surface px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-ghost transition-colors",
        error ? "border-danger focus-visible:shadow-ring" : "border-line hover:border-line-strong focus-visible:border-accent focus-visible:shadow-ring",
        className,
      )}
      {...rest}
    />
  );
});
