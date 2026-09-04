import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, CircleDashed, ExternalLink } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card, SectionHeader } from "../components/primitives/Card";

const RAZORPAY = {
  title: "Razorpay", status: "Connected · Test Mode", description: "Payment rail adapter. Tokey evaluates authority and independently verifies settlement evidence.",
  rows: [["Orders", "Verified"], ["Checkout", "Verified"], ["Signed webhooks", "Verified"], ["Trusted settlement verification", "Verified"], ["Exactly-once capture", "Verified"]],
};

const OPENCLAW = {
  title: "OpenClaw", status: "Live verified", description: "Agent runtime connected to Tokey through MCP.",
  rows: [["Connection", "MCP"], ["Runtime", "OpenClaw"], ["Channel", "Telegram"], ["Observed path", "Telegram → TON → OpenClaw → Tokey MCP → Core"]],
};

export function IntegrationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const rail = id === "openclaw" ? OPENCLAW : RAZORPAY;
  const isRazorpay = id !== "openclaw";
  return <div className="mx-auto max-w-5xl space-y-5">
    <Link to="/integrations" className="inline-flex items-center gap-1 text-xs text-ink-3 transition-colors hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" /> Integrations</Link>
    <SectionHeader title={rail.title} description={rail.description} action={<Badge tone="ok" dot>{rail.status}</Badge>} />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]"><Card><div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3">Capabilities</div><dl className="mt-3 divide-y divide-line">{rail.rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3 text-xs"><dt className="text-ink-2">{label}</dt><dd className="flex items-center gap-1.5 text-right font-medium text-ink">{value === "Verified" && <Check className="h-3.5 w-3.5 text-ok" />}{value}</dd></div>)}</dl></Card>
      <Card><div className="text-[10px] font-semibold uppercase tracking-[0.09em] text-ink-3">Status</div><div className="mt-3 flex items-start gap-2"><CircleDashed className="mt-0.5 h-4 w-4 text-ok" /><div><div className="text-xs font-medium text-ink">{isRazorpay ? "End-to-end verified" : "Runtime connection verified"}</div><p className="mt-1 text-[11px] leading-5 text-ink-3">{isRazorpay ? "Razorpay Test Mode proof is recorded as a rail-level verification, not a replacement for Tokey's economic record." : "OpenClaw remains an agent runtime; Tokey remains the financial authority."}</p></div></div></Card></div>
    {isRazorpay && <Card><SectionHeader title="Last verified transaction" description="Canonical Test Mode rail proof." /><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div><div className="text-[10px] text-ink-3">Amount</div><div className="mt-1 text-sm font-semibold text-ink">₹1,799 INR</div></div><div><div className="text-[10px] text-ink-3">Provider order</div><code className="mt-1 block text-[11px] text-ink">order_TXyMzUr2UugFqz</code></div><div><div className="text-[10px] text-ink-3">Provider payment</div><code className="mt-1 block text-[11px] text-ink">pay_TXydA9YASOdQQ5</code></div><div><div className="text-[10px] text-ink-3">Tokey finality</div><div className="mt-1 text-xs font-medium text-ok">VERIFIED_CAPTURE</div></div></div><div className="mt-4 border-t border-line pt-3 text-[11px] text-ink-3">Receipt <code className="ml-1 text-ink">rcpt_9b19f70f334142d687923085cccdcbe9</code></div></Card>}
    <div className="flex items-center gap-2 text-[11px] text-ink-3"><ExternalLink className="h-3.5 w-3.5" /> No credentials, webhook secrets, or signing material are displayed in this console.</div>
  </div>;
}
