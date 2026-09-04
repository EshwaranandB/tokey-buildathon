import { cn } from "../../lib/cn";

interface TabsProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-md bg-sunken p-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            active === tab.id ? "bg-surface text-ink shadow-card" : "text-ink-soft hover:text-ink",
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="tk-num rounded bg-line px-1.5 text-[10px] text-ink-faint">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
