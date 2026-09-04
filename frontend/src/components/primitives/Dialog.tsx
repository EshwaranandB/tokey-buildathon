import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Dialog({ open, onClose, title, description, children, footer, size = "md" }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "animate-scale-in w-full rounded-card bg-surface shadow-pop",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-lg",
          size === "lg" && "max-w-2xl",
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-line px-5 py-4">
            <div>
              {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-ink-faint">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-md p-1 text-ink-faint hover:bg-sunken hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children && <div className="max-h-[60vh] overflow-y-auto px-5 py-4">{children}</div>}
        {footer && <div className="flex justify-end gap-2 border-t border-line px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
