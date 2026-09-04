import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import { useAuth } from "../lib/store";
import { formatMoney, timeAgo } from "../lib/format";
import { formatAgentName, formatStatus } from "../lib/presentation";
import { Badge } from "../components/primitives/Badge";
import { Card, SectionHeader } from "../components/primitives/Card";
import { EmptyState } from "../components/primitives/EmptyState";
import { Table } from "../components/primitives/Table";

const FILTERS = ["All", "Captured", "Reserved", "Approval required", "Denied", "Unknown"] as const;
function stateFilter(filter: string, state: string) { return filter === "All" || state === filter.toUpperCase().replace(" ", "_") || (filter === "Reserved" && state === "EXECUTING"); }
function tone(state: string): "ok" | "warn" | "danger" | "mystery" | "neutral" { if (state === "CAPTURED" || state === "RESERVED") return "ok"; if (state === "APPROVAL_REQUIRED") return "warn"; if (state === "DENIED" || state === "RELEASED") return "danger"; if (state === "UNKNOWN") return "mystery"; return "neutral"; }

export function TransactionsPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  useEffect(() => {
    let cancelled = false;
    api.dashboardTransactions().then((result) => !cancelled && setItems(result.items)).catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, [api]);
  const rows = useMemo(() => items.filter((item) => stateFilter(filter, item.state)), [filter, items]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SectionHeader title="Transactions" description="Every economic action stays linked to its agent, authority, rail, and receipt." />
      <div className="flex gap-1 overflow-x-auto border-b border-line" role="tablist" aria-label="Transaction filters">{FILTERS.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={`whitespace-nowrap border-b-2 px-2.5 py-2 text-xs transition-colors ${filter === item ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"}`}>{item}</button>)}</div>
      {rows.length === 0 ? <EmptyState icon={<ArrowLeftRight className="h-5 w-5" />} title={items.length ? `No ${filter.toLowerCase()} transactions` : "No transactions"} description="Requests will appear here once agents evaluate an economic action." /> : <Card padding="none"><Table rowKey="id" rows={rows.map((item) => ({ id: item.id, time: timeAgo(item.requested_at), amount: <span className="font-medium">{formatMoney(item.amount_micros, item.currency)}</span>, agent: formatAgentName(item.agent_id), merchant: item.vendor || "—", rail: item.rail || "—", state: <Badge tone={tone(item.state)} dot>{formatStatus(item.state)}</Badge> }))} columns={[{ key: "time", header: "Time", width: "110px" }, { key: "amount", header: "Amount", align: "right" }, { key: "agent", header: "Agent" }, { key: "merchant", header: "Merchant" }, { key: "rail", header: "Rail" }, { key: "state", header: "State" }]} onRowClick={(row) => navigate(`/transactions/${encodeURIComponent(String((items.find((item) => item.id === row.id)?.reservation_id) || row.id))}`)} /></Card>}
    </div>
  );
}

