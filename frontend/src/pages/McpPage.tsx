import { Braces } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card, SectionHeader } from "../components/primitives/Card";

const AGENT_TOOLS = [
  ["tokey_check_authority", "Read the current authority state for the credential-bound agent."],
  ["tokey_request_spend", "Request a governed economic action; Tokey returns allow, deny, or approval required."],
  ["tokey_execution_authorize", "Issue a context-bound authorization for an allowed reservation."],
  ["tokey_inspect_reservation", "Read reservation state without modifying it."],
  ["tokey_inspect_receipt", "Read one immutable audit receipt."],
];
const OPERATOR_TOOLS = [
  ["tokey_create_authority", "Grant a root authority."],
  ["tokey_delegate_authority", "Delegate attenuated authority to a child agent."],
  ["tokey_approve_spend", "Decide an approval-required request."],
  ["tokey_revoke_authority", "Revoke authority and cancel active reservations."],
  ["tokey_audit_trail", "Read an authority receipt chain."],
  ["tokey_reconcile_execution", "Reconcile an unknown execution result."],
];

function ToolTable({ title, tone, tools }: { title: string; tone: "ok" | "info"; tools: string[][] }) {
  return <Card padding="none"><div className="flex items-center justify-between border-b border-line px-4 py-3"><div className="text-xs font-semibold text-ink">{title}</div><Badge tone={tone}>{tone === "ok" ? "Scoped agent access" : "Operator access"}</Badge></div><div className="divide-y divide-line">{tools.map(([name, description]) => <div key={name} className="grid gap-1 px-4 py-3 sm:grid-cols-[220px_minmax(0,1fr)]"><code className="text-[11px] text-ink">{name}</code><p className="text-[11px] leading-5 text-ink-3">{description}</p></div>)}</div></Card>;
}

export function McpPage() {
  return <div className="mx-auto max-w-6xl space-y-5"><SectionHeader title="MCP" description="Tokey exposes a governed tool surface to agent runtimes. Credentials determine identity and scope; tool arguments never grant authority." action={<Badge tone="neutral">Tool contract</Badge>} /><div className="flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-2 text-xs text-ink-2"><Braces className="h-3.5 w-3.5 text-ink-3" /> Tokey MCP · current runtime connectivity is not reported</div><ToolTable title="Agent-safe tools" tone="ok" tools={AGENT_TOOLS} /><ToolTable title="Operator tools" tone="info" tools={OPERATOR_TOOLS} /></div>;
}
