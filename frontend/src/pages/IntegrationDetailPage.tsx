import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../lib/store";
import { integrations } from "../lib/integrations";
import { latestRazorpayCapture } from "../lib/records";
import { formatMoneyExact, formatDateTime } from "../lib/format";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Skeleton } from "../components/primitives/Skeleton";
import { EmptyState } from "../components/primitives/EmptyState";

export function IntegrationDetailPage() {
  const { id } = useParams();
  const { api } = useAuth();
  const [proof,setProof] = useState<Awaited<ReturnType<typeof latestRazorpayCapture>>>(null);
  const [loading,setLoading] = useState(id === "razorpay");
  const [error,setError] = useState("");
  useEffect(() => {
    let active = true; setProof(null); setError("");
    setLoading(id === "razorpay");
    if (id === "razorpay") latestRazorpayCapture(api).then(p => {if(active)setProof(p);})
      .catch(e => {if(active)setError(e instanceof Error ? e.message : "Could not load evidence");})
      .finally(() => {if(active)setLoading(false);});
    return () => {active=false;};
  },[id,api]);
  const integration = integrations.find(item => item.id === id);
  if (!integration) return <EmptyState title="Integration not found" description="Choose an integration from the catalogue." />;
  if (id !== "razorpay" && id !== "openclaw") return <div className="mx-auto max-w-3xl space-y-5"><Link to="/integrations" className="text-xs underline">Back to integrations</Link><SectionHeader title={integration.name} description={integration.description}/><Card><p className="text-sm">Status: {integration.status}</p><p className="my-3 text-xs text-ink-3">This catalogue entry does not establish a live connection. Runtime adapters require a provisioned agent credential and verified enforcement of the Tokey contract. Planned payment rails cannot execute through this console.</p><div className="flex gap-4 text-xs underline"><Link to="/mcp">Tokey MCP contract</Link><Link to="/api">Tokey API contract</Link>{integration.url && <a href={integration.url} target="_blank" rel="noreferrer">Official product site</a>}</div></Card></div>;
  return <div className="mx-auto max-w-5xl space-y-5">
    <Link to="/integrations" className="text-xs underline">Back to integrations</Link>
    <SectionHeader title={id === "razorpay" ? "Razorpay" : "OpenClaw"} description={id === "razorpay" ? "FitFuel Test Mode merchant proof. Core authority supports general agent requests; this adapter is merchant-specific." : "External agent runtime using authenticated Tokey MCP tools."} />
    <Card><p className="text-sm">Current connection health: not reported by Core.</p><p className="mt-2 text-xs text-ink-3">Recorded evidence describes a past outcome, not current service availability.</p></Card>
    {id === "openclaw" ? <Card>A Telegram/OpenClaw authority inspection was previously demonstrated. Runtime metadata is not available from this API. <Link to="/mcp" className="underline">View MCP contract</Link></Card> :
      loading ? <Skeleton lines={5} /> : error ? <Card><p role="alert" className="text-danger">{error}</p></Card> : !proof ? <EmptyState title="No verified transaction yet" description="No captured Razorpay transaction with a matching Core capture receipt was returned." /> :
      <Card><SectionHeader title="Latest recorded Razorpay capture" description={formatDateTime(proof.receipt.created_at)} />
        <div className="my-4 text-xl">{formatMoneyExact(proof.transaction.amount_micros,proof.transaction.currency)}</div>
        <dl className="space-y-2 break-words text-sm">
          <dt>Agent / merchant</dt><dd>{proof.transaction.agent_id} / {proof.transaction.vendor}</dd>
          <dt>Core state</dt><dd>{proof.transaction.state}</dd>
          <dt>Provider reference from receipt</dt><dd>{String(proof.receipt.payload.external_transaction_id ?? "Not recorded")}</dd>
          <dt>Capture receipt</dt><dd>{proof.receipt.id}</dd>
        </dl>
        <div className="mt-4 flex gap-4 text-xs underline"><Link to={"/transactions/"+encodeURIComponent(proof.transaction.id)}>Inspect request and settlement</Link><Link to={"/receipts?authority="+encodeURIComponent(proof.transaction.authority_id)+"&receipt="+encodeURIComponent(proof.receipt.id)}>Inspect receipt</Link></div>
        <p className="mt-4 text-xs text-ink-3">Provider order and raw verification evidence are not exposed by this read API. No verification verdict is inferred from a UI badge.</p>
      </Card>}
  </div>;
}
