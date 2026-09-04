import { cn } from "../../lib/cn";

interface TableProps {
  columns: Array<{ key: string; header: string; align?: "left" | "right"; width?: string; className?: string }>;
  rows: Record<string, unknown>[];
  rowKey: string;
  onRowClick?: (row: Record<string, unknown>) => void;
  empty?: string;
}

export function Table({ columns, rows, rowKey, onRowClick, empty }: TableProps) {
  if (rows.length === 0 && empty) {
    return <p className="px-3 py-6 text-center text-xs text-ink-faint">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[12.5px]">
        <thead>
          <tr className="border-b border-line text-left text-[11px] font-medium text-ink-3">
            {columns.map((c) => (
              <th key={c.key} className={cn("px-3 py-2 font-medium", c.align === "right" ? "text-right" : "text-left", c.className)} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const key = String(row[rowKey] ?? "");
            return (
              <tr
                key={key}
                onClick={() => onRowClick?.(row)}
                className={cn("border-b border-line/60 transition-colors duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]", onRowClick && "cursor-pointer hover:bg-hover")}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2", c.align === "right" ? "text-right tk-num" : "text-left", c.className)}>
                    {row[c.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
