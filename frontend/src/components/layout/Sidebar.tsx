import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Bot,
  ArrowLeftRight,
  CheckSquare,
  ReceiptText,
  Settings,
  Cable,
  Braces,
  Webhook,
  Code2,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { useAuth } from "../../lib/store";
import { Badge } from "../primitives/Badge";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/authorities", label: "Authorities", icon: ShieldCheck },
  { to: "/agents", label: "Agents", icon: Bot },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/approvals", label: "Approvals", icon: CheckSquare },
  { to: "/receipts", label: "Receipts", icon: ReceiptText },
];

const DEVELOPER_NAV = [
  { to: "/integrations", label: "Integrations", icon: Cable },
  { to: "/mcp", label: "MCP", icon: Braces },
  { to: "/api", label: "API", icon: Code2 },
  { to: "/webhooks", label: "Webhooks", icon: Webhook },
];

export function Sidebar() {
  const { actor, mock } = useAuth();
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-line bg-surface">
      <div className="px-4 py-4">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold tracking-[-0.03em] text-ink">Tokey</div>
          <div className="mt-0.5 truncate text-[10px] text-ink-3">Financial control plane</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-auto px-2 py-2" aria-label="Tokey navigation">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-control px-2.5 py-1.5 text-[13px] transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                isActive ? "bg-inset font-medium text-ink shadow-hairline" : "text-ink-2 hover:bg-hover hover:text-ink",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
        <div className="px-2.5 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3">Developers</div>
        {DEVELOPER_NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 rounded-control px-2.5 py-1.5 text-[13px] transition-[background-color,color] duration-200",
              isActive ? "bg-inset font-medium text-ink shadow-hairline" : "text-ink-2 hover:bg-hover hover:text-ink",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3.5">
        <NavLink to="/settings" className={({ isActive }) => cn("mb-3 flex items-center gap-2.5 rounded-control px-2.5 py-1.5 text-[13px] transition-colors", isActive ? "bg-inset font-medium text-ink" : "text-ink-2 hover:bg-hover hover:text-ink")}>
          <Settings className="h-4 w-4" /> Settings
        </NavLink>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-inset text-[10px] font-semibold text-ink">
            {actor?.role?.slice(0, 2) ?? "??"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-medium text-ink">{actor?.actor_id ?? "operator"}</div>
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[10px] text-ink-3">{actor?.role ?? "unknown"}</span>
              {mock && <Badge tone="warn">demo</Badge>}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
