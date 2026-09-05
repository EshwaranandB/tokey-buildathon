import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { EmptyState } from "../components/primitives/EmptyState";
import { ShieldCheck } from "lucide-react";
import { formatAgentName, formatStatus } from "../lib/presentation";
import { formatMoney, truncateMiddle } from "../lib/format";
import { Table } from "../components/primitives/Table";
import type { Authority } from "../lib/types";

export function AuthoritiesPage() {
  const { api, actor } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState<Authority[]>([]);
  useEffect(() => {
    let cancelled = false;
    api.dashboardAuthorities()
      .then((result) => !cancelled && setSeeded(result.items))
      .catch(() => {if(!cancelled)setError("Could not load records from Core.");}).finally(() => {if(!cancelled)setLoading(false);});
    return () => {
      cancelled = true;
    };
  }, [api]);

  const authorities = seeded;

  if (loading) return <Card><p role="status">Loading records…</p></Card>;
  if (error) return <Card><p role="alert" className="text-danger">{error}</p></Card>;
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SectionHeader
        title="Authorities"
        description="Real spending authority granted to your agents."
        action={actor && ["OWNER", "ADMIN"].includes(actor.role) ? <Link className="rounded-control bg-ink px-3 py-2 text-xs text-surface" to="/authorities/new">Grant authority</Link> : undefined}
      />

      {authorities.length === 0 ? (
        <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No authorities yet" description="Issue a root authority to grant an agent spending power." />
      ) : (
        <Card padding="none"><Table rowKey="id" rows={authorities.map((a) => ({ id: a.id, authority: <code className="text-[11px]">{truncateMiddle(a.id)}</code>, agent: <><span className="font-medium">{formatAgentName(a.agent_id)}</span><span className="ml-2 font-mono text-[10px] text-ink-3">{a.agent_id}</span></>, granted: formatMoney(a.granted_micros ?? a.balance_micros, a.currency), reserved: formatMoney(a.reserved_micros, a.currency), captured: formatMoney(a.captured_micros ?? 0, a.currency), available: formatMoney(a.available_micros, a.currency), policy: `${a.scope.vendors.join(", ")} · ${a.scope.rails.join(", ")}`, status: <Badge tone={a.status === "ACTIVE" ? "ok" : "danger"} dot>{formatStatus(a.status)}</Badge> }))} columns={[{ key: "authority", header: "Authority" }, { key: "agent", header: "Agent" }, { key: "granted", header: "Granted", align: "right" }, { key: "reserved", header: "Reserved", align: "right" }, { key: "captured", header: "Captured", align: "right" }, { key: "available", header: "Available", align: "right" }, { key: "policy", header: "Policy" }, { key: "status", header: "Status" }]} onRowClick={(row) => navigate(`/authorities/${encodeURIComponent(String(row.id))}`)} /></Card>
      )}
    </div>
  );
}

