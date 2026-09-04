import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/store";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { EmptyState } from "../components/primitives/EmptyState";
import { Bot } from "lucide-react";
import type { Authority } from "../lib/types";
import { formatMoney } from "../lib/format";
import { formatAgentName } from "../lib/presentation";
import { Table } from "../components/primitives/Table";

export function AgentsPage() {
  const { api } = useAuth();
  const [authorities, setAuthorities] = useState<Authority[]>([]);

  useEffect(() => {
    let cancelled = false;
    api.dashboardAuthorities().then((result) => !cancelled && setAuthorities(result.items)).catch(() => !cancelled && setAuthorities([]));
    return () => { cancelled = true; };
  }, [api]);

  const agents = useMemo(() => Object.values(authorities.reduce<Record<string, { id: string; currency: string; granted: number; captured: number; available: number; active: boolean }>>((all, authority) => {
    const row = all[authority.agent_id] || { id: authority.agent_id, currency: authority.currency, granted: 0, captured: 0, available: 0, active: false };
    row.granted += authority.granted_micros ?? authority.balance_micros;
    row.captured += authority.captured_micros ?? 0;
    row.available += authority.available_micros;
    row.active ||= authority.status === "ACTIVE";
    all[authority.agent_id] = row;
    return all;
  }, {})), [authorities]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <SectionHeader title="Agents" description="Autonomous identities with authority issued by Tokey." />
      {agents.length === 0 ? <EmptyState icon={<Bot className="h-5 w-5" />} title="No agents with authority" description="Agents appear here when an authority is issued to them." /> : <Card padding="none"><Table rowKey="id" rows={agents.map((agent) => ({ id: agent.id, agent: <><span className="font-medium">{formatAgentName(agent.id)}</span><span className="ml-2 font-mono text-[10px] text-ink-3">{agent.id}</span></>, runtime: agent.id === "shopping-agent" ? "OpenClaw · MCP" : "Core API", authority: formatMoney(agent.granted, agent.currency), captured: formatMoney(agent.captured, agent.currency), available: formatMoney(agent.available, agent.currency), status: <Badge tone={agent.active ? "ok" : "neutral"} dot>{agent.active ? "Active" : "Inactive"}</Badge>, activity: agent.id === "shopping-agent" ? "Telegram runtime verified" : "Authority-derived" }))} columns={[{ key: "agent", header: "Agent" }, { key: "runtime", header: "Runtime" }, { key: "authority", header: "Authority", align: "right" }, { key: "captured", header: "Captured", align: "right" }, { key: "available", header: "Available", align: "right" }, { key: "status", header: "Status" }, { key: "activity", header: "Last activity" }]} /></Card>}
    </div>
  );
}

