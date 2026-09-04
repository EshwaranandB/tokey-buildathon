import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useAuth, useRecent } from "../../lib/store";
import { detectRefKind, KIND_LABEL } from "../../lib/ids";
import { timeAgo } from "../../lib/format";
import { useNavigate } from "react-router-dom";
import { Button } from "../primitives/Button";

const ROUTE_FOR_KIND: Record<string, string> = {
  authority: "/authorities/",
  spend: "/transactions/",
  reservation: "/transactions/",
  receipt: "/receipts/",
  execution_auth: "/transactions/",
  execution_record: "/transactions/",
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const recent = useRecent();
  const { signOut, actor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const filtered = query.trim()
    ? recent.filter((r) => r.id.toLowerCase().includes(query.toLowerCase()) || r.label?.toLowerCase().includes(query.toLowerCase()))
    : recent.slice(0, 12);

  if (!open) return null;

  const run = (id: string) => {
    const kind = detectRefKind(id);
    if (kind && ROUTE_FOR_KIND[kind]) {
      navigate(ROUTE_FOR_KIND[kind] + encodeURIComponent(id));
    } else {
      navigate(`/transactions/${encodeURIComponent(id)}`);
    }
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 pt-[18vh]" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg animate-scale-in rounded-card border border-line bg-surface shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any ID, or pick a recent item…"
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-ghost focus:outline-none"
          />
          <Button variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5" />} onClick={() => setOpen(false)} />
        </div>

        <div className="max-h-80 overflow-auto p-1.5">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-ink-faint">
              {query ? "No matching IDs in your recent activity." : "No recent activity yet — create an authority or spend to populate this."}
            </div>
          )}
          {filtered.map((ref) => (
            <button
              key={ref.id}
              onClick={() => run(ref.id)}
              className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-sunken"
            >
              <span className="tk-num shrink-0 rounded bg-sunken px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                {KIND_LABEL[detectRefKind(ref.id) ?? "authority"]}
              </span>
              <span className="tk-num min-w-0 flex-1 truncate font-mono text-xs text-ink">{ref.id}</span>
              <span className="shrink-0 text-[10px] text-ink-faint">{timeAgo(ref.at)}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line px-3 py-2 text-[10px] text-ink-faint">
          <span className="flex items-center gap-2">
            <span className="tk-kbd">⌘</span><span className="tk-kbd">K</span> to toggle
            <span className="tk-kbd">esc</span> to close
          </span>
          <button onClick={signOut} className="text-ink-soft hover:text-ink">
            sign out {actor?.actor_id}
          </button>
        </div>
      </div>
    </div>
  );
}
