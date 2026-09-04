import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/store";
import { formatMoney, timeAgo } from "../lib/format";
import { formatAgentName, formatStatus } from "../lib/presentation";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Stat } from "../components/primitives/Stat";
import { Badge } from "../components/primitives/Badge";
import { Skeleton } from "../components/primitives/Skeleton";
import { EmptyState } from "../components/primitives/EmptyState";
import { Cable } from "lucide-react";

type CurrencySummary = { currency: string; captured_micros: number; reserved_micros: number; available_authority_micros: number };
type Activity = { id: string; agent_id: string; vendor: string; amount_micros: number; currency: string; state: string; requested_at: string };
type Summary = { currencies: CurrencySummary[]; pending_approvals: number; denied_actions: number; active_agents: number; unknown_settlements: number; recent_activity?: Activity[] };

export function OverviewPage() {
  const { api } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.dashboardSummary().then((data) => !cancelled && setSummary(data)).catch(() => !cancelled && setSummary(null)).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [api]);

  return <div className="mx-auto max-w-6xl space-y-5">
    <SectionHeader title="Overview" description="Monitor financial activity across your agents." />
    {loading ? <Skeleton lines={4} /> : !summary ? <EmptyState title="Core unavailable" description="Tokey could not load the dashboard summary." /> : <>
      {summary.currencies.length === 0 ? <EmptyState title="No financial activity yet" description="Authorities and agent activity will appear here when Core records exist." /> : summary.currencies.map((row) => <section key={row.currency} className="space-y-2">
        <h3 className="text-xs font-semibold text-ink-2">{row.currency}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Captured" value={formatMoney(row.captured_micros, row.currency)} hint="Settled by Core" />
          <Stat label="Reserved" value={formatMoney(row.reserved_micros, row.currency)} hint="Protected in-flight authority" />
          <Stat label="Available authority" value={formatMoney(row.available_authority_micros, row.currency)} hint="Available for new requests" />
        </div>
      </section>)}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Pending approvals" value={String(summary.pending_approvals)} />
        <Stat label="Denied actions" value={String(summary.denied_actions)} />
        <Stat label="Active agents" value={String(summary.active_agents)} />
        <Stat label="Unknown settlements" value={String(summary.unknown_settlements)} />
      </div>
      <Card><SectionHeader title="Recent transactions" description="Persisted economic actions from Core." />
        {!summary.recent_activity?.length ? <EmptyState title="No recent activity" description="Your agents haven’t created any economic activity yet." /> : <ul className="mt-3 divide-y divide-line">{summary.recent_activity.map((item) => <li key={item.id} className="flex items-center gap-3 py-2">
          <Badge tone={item.state === "CAPTURED" ? "ok" : item.state === "APPROVAL_REQUIRED" ? "warn" : "neutral"}>{formatStatus(item.state)}</Badge>
          <Link to={`/transactions/${encodeURIComponent(item.id)}`} className="flex-1 truncate text-xs text-ink">{formatAgentName(item.agent_id)} · {item.vendor}</Link>
          <span className="text-xs text-ink-2">{formatMoney(item.amount_micros, item.currency)}</span><span className="text-[10px] text-ink-3">{timeAgo(item.requested_at)}</span>
        </li>)}</ul>}
      </Card>
      <Card padding="sm"><div className="flex items-center gap-3"><Cable className="h-4 w-4 text-ink-3" /><div className="min-w-0 flex-1"><div className="text-xs font-medium text-ink">Connected integrations</div><p className="mt-0.5 text-[11px] text-ink-3">Razorpay Test Mode · OpenClaw MCP runtime</p></div><Link to="/integrations" className="text-xs font-medium text-accent hover:text-accent-strong">View integrations</Link></div></Card>
    </>}
  </div>;
}
