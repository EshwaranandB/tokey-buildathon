import { Bell, Command, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../../lib/store";
import { Button } from "../primitives/Button";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dropdown, DropdownDivider, DropdownItem } from "../primitives/Dropdown";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { actor, mock, api, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [health, setHealth] = useState<{ ok: boolean; version: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.health().then((h) => !cancelled && setHealth({ ok: h.ok, version: h.version })).catch(() => !cancelled && setHealth(null));
    return () => {
      cancelled = true;
    };
  }, [api, location.pathname]);

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
      <div className="flex items-center gap-2 text-[12px] text-ink-3">
        <span className="font-medium text-ink">{location.pathname === "/" ? "Overview" : location.pathname.slice(1).split("/").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" / ")}</span>
        <span className="rounded bg-inset px-1.5 py-0.5 text-[10px] font-medium text-ink-2">Development</span>
        {mock && <span className="rounded bg-warn-soft px-1.5 py-0.5 text-[10px] font-medium text-warn-strong">demo mode</span>}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          icon={<Command className="h-3.5 w-3.5" />}
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
        >
          <span className="tk-kbd">⌘</span>K
        </Button>
        <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
          <span className={`h-1.5 w-1.5 rounded-full ${health ? (health.ok ? "bg-ok" : "bg-warn") : "bg-ink-ghost"}`} />
          <span className="tk-num">{health ? `core ${health.version}` : "connecting…"}</span>
        </div>
        <button type="button" aria-label="Notifications" className="ml-1 flex h-7 w-7 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-hover hover:text-ink">
          <Bell className="h-3.5 w-3.5" />
        </button>
        <Dropdown trigger={<button type="button" className="ml-1 flex h-7 items-center gap-2 rounded-control px-1.5 text-left transition-colors hover:bg-hover"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-inset text-[9px] font-semibold text-ink">{actor?.role?.slice(0, 2) ?? "??"}</span><span className="hidden text-[11px] font-medium text-ink sm:inline">{actor?.actor_id ?? "Unknown"}</span></button>}>
          <div className="px-3 py-2"><div className="text-xs font-medium text-ink">{actor?.actor_id ?? "Unknown"}</div><div className="mt-0.5 text-[10px] text-ink-3">{actor?.role ?? "Owner"}</div></div>
          <DropdownDivider />
          <DropdownItem icon={<UserRound />} onClick={() => navigate("/settings")}>Profile</DropdownItem>
          <DropdownItem icon={<Settings />} onClick={() => navigate("/settings")}>Workspace settings</DropdownItem>
          <DropdownItem icon={<ShieldCheck />} onClick={() => navigate("/settings")}>Security</DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={<LogOut />} danger onClick={signOut}>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
