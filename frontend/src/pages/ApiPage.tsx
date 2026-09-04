import { Code2 } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card, SectionHeader } from "../components/primitives/Card";

const CAPABILITIES = [
  ["Authorities", "Create, attenuate, inspect, and revoke bounded authority."],
  ["Spend requests", "Deterministic allow, deny, and approval-required evaluation."],
  ["Approvals", "Operator decisions for threshold-controlled requests."],
  ["Execution", "Context-bound authorization, execution records, and reconciliation."],
  ["Receipts", "Immutable evidence for financial state changes."],
];

export function ApiPage() {
  return <div className="mx-auto max-w-6xl space-y-5"><SectionHeader title="API" description="The Core HTTP API is the programmatic control plane for Tokey." action={<Badge tone="ok" dot>Core available</Badge>} /><Card><div className="flex items-start gap-3"><Code2 className="mt-0.5 h-4 w-4 text-ink-3" /><div><div className="text-xs font-medium text-ink">Authentication</div><p className="mt-1 text-[11px] leading-5 text-ink-3">Tokey credentials bind requests to a tenant and role. Browser dashboard sessions use secure cookies and CSRF validation for unsafe requests.</p></div></div></Card><Card padding="none"><div className="border-b border-line px-4 py-3 text-xs font-semibold text-ink">Current API capabilities</div><div className="divide-y divide-line">{CAPABILITIES.map(([name, description]) => <div key={name} className="grid gap-1 px-4 py-3 sm:grid-cols-[160px_minmax(0,1fr)]"><div className="text-xs font-medium text-ink">{name}</div><div className="text-[11px] leading-5 text-ink-3">{description}</div></div>)}</div></Card><p className="text-[11px] text-ink-3">SDK install commands are not shown because no public SDK package is being claimed in this console.</p></div>;
}
