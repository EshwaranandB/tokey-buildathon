import { Link } from "react-router-dom";
import { ArrowUpRight, Bot, Cable, CreditCard, MessageCircle } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card, SectionHeader } from "../components/primitives/Card";

type Integration = { id: string; name: string; description: string; status: string; tone: "ok" | "warn" | "neutral" | "info"; detail?: boolean };

const RUNTIMES: Integration[] = [
  { id: "openclaw", name: "OpenClaw", description: "MCP runtime · Telegram → TON → Tokey Core", status: "Live verified", tone: "ok", detail: true },
  { id: "codex", name: "Codex", description: "Connected through the OpenClaw runtime", status: "Connected", tone: "info" },
  { id: "custom-agent", name: "Custom agent", description: "Scoped access through HTTP API or MCP", status: "Available", tone: "info" },
  { id: "openai-agents", name: "OpenAI Agents SDK", description: "MCP-compatible integration direction", status: "Compatible", tone: "neutral" },
  { id: "claude-code", name: "Claude Code", description: "Agent runtime integration", status: "Planned", tone: "neutral" },
  { id: "gemini-cli", name: "Gemini CLI", description: "Agent runtime integration", status: "Planned", tone: "neutral" },
];

const RAILS: Integration[] = [
  { id: "razorpay", name: "Razorpay", description: "Orders · checkout · signed webhook verification", status: "Connected · Test", tone: "ok", detail: true },
  { id: "x402", name: "x402", description: "Authorization boundary and guarded execution", status: "Alpha", tone: "warn" },
  { id: "stripe", name: "Stripe", description: "Payment rail adapter", status: "Planned", tone: "neutral" },
  { id: "upi", name: "UPI", description: "Payment rail adapter", status: "Planned", tone: "neutral" },
];

function IntegrationCard({ item }: { item: Integration }) {
  const inner = <article className="group min-h-[122px] rounded-card border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-card">
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-[13px] font-semibold text-ink">{item.name}</h3><p className="mt-1 text-[11px] leading-5 text-ink-3">{item.description}</p></div>{item.detail && <ArrowUpRight className="h-4 w-4 text-ink-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}</div>
    <Badge tone={item.tone} dot className="mt-4">{item.status}</Badge>
  </article>;
  return item.detail ? <Link to={`/integrations/${item.id}`} className="block focus-visible:rounded-card">{inner}</Link> : inner;
}

export function IntegrationsPage() {
  return <div className="mx-auto max-w-6xl space-y-7">
    <SectionHeader title="Integrations" description="Runtimes and payment rails connected to the Tokey control plane." />
    <section><div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3"><Bot className="h-3.5 w-3.5" /> Agent runtimes</div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{RUNTIMES.map((item) => <IntegrationCard key={item.id} item={item} />)}</div></section>
    <section><div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3"><CreditCard className="h-3.5 w-3.5" /> Payment rails</div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{RAILS.map((item) => <IntegrationCard key={item.id} item={item} />)}</div></section>
    <Card padding="sm"><div className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-ink-3" /><div><div className="text-xs font-medium text-ink">Telegram</div><p className="mt-0.5 text-[11px] text-ink-3">Live verified through OpenClaw. Other channels remain runtime capabilities, not separately verified Tokey connections.</p></div><Badge tone="ok" dot className="ml-auto">Live verified</Badge></div></Card>
    <div className="flex items-center gap-2 text-[11px] text-ink-3"><Cable className="h-3.5 w-3.5" /> Statuses describe the current integration state; planned rails do not have live Tokey execution.</div>
  </div>;
}
