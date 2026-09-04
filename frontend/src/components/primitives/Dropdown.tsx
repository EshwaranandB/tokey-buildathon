import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "animate-scale-in absolute z-40 mt-1 min-w-[180px] rounded-md border border-line bg-surface py-1 shadow-pop",
            align === "right" ? "right-0" : "left-0",
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, icon, onClick, danger }: { children: ReactNode; icon?: ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-sunken",
        danger ? "text-danger" : "text-ink",
      )}
    >
      {icon && <span className="h-3.5 w-3.5 text-ink-faint">{icon}</span>}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-line" />;
}

export { ChevronDown };
