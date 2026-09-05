import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../lib/store";
import { transactions, matchingReceipts, type Transaction } from "../lib/records";
import type { Receipt, Reservation, ExecutionRecord } from "../lib/types";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Skeleton } from "../components/primitives/Skeleton";
import { formatMoneyExact, formatDateTime } from "../lib/format";

export function TransactionDetailPage() {
  const { id } = useParams();
  const { api } = useAuth();
  const [data,setData] = useState<{transaction:Transaction;reservation:Reservation|null;receipts:Receipt[];records:ExecutionRecord[]}|null>(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    let active=true; setLoading(true); setError(""); setData(null);
    (async () => {
      const transaction = (await transactions(api)).find(t => t.id === id || t.reservation_id === id);
      if (!transaction) throw new Error("Request not found in this tenant.");
      const [reservation, receipts, records] = await Promise.all([
        transaction.reservation_id ? api.getReservation(transaction.reservation_id) : Promise.resolve(null),
        api.getAuthorityReceipts(transaction.authority_id),
        transaction.reservation_id ? api.getExecutionRecords(transaction.reservation_id) : Promise.resolve([])]);
      if(active)setData({transaction,reservation,receipts:matchingReceipts(receipts,transaction),records});
    })().catch(e => {if(active)setError(e instanceof Error ? e.message : "Could not load transaction");}).finally(() => {if(active)setLoading(false);});
    return () => {active=false;};
  },[api,id]);
  if(loading)return <Skeleton lines={8}/>;
  if(error || !data)return <Card><p role="alert">{error || "Request not found"}</p></Card>;
  const t=data.transaction;
  return <div className="mx-auto max-w-5xl space-y-5">
    <Link className="text-xs underline" to="/transactions">Back to transactions</Link>
    <SectionHeader title={formatMoneyExact(t.amount_micros,t.currency)} description={t.state+" · "+t.agent_id+" · "+t.vendor}/>
    <Card><dl className="grid gap-3 text-sm sm:grid-cols-2">
      {[["Request",t.id],["Purpose",t.purpose],["Resource",t.resource_type],["Rail",t.rail],["Requested",formatDateTime(t.requested_at)],["Reservation",data.reservation?.id ?? "None"],["Settlement state",data.reservation?.status ?? "No reservation"],["Provider reference",data.reservation?.external_ref ?? "Not recorded"],["Finalized",formatDateTime(data.reservation?.finalized_at)]].map(([k,v]) => <div className="break-words" key={k}><dt className="text-ink-3">{k}</dt><dd>{v}</dd></div>)}
    </dl><Link className="mt-4 block text-xs underline" to={"/authorities/"+encodeURIComponent(t.authority_id)}>Inspect mandate / revoke authority</Link></Card>
    {t.state === "APPROVAL_REQUIRED" && <Link to="/approvals" className="block text-sm underline">Review pending approval</Link>}
    <Card><SectionHeader title="Execution" description="Execution is performed by the authorized runtime and rail adapter. This console does not select outcomes."/>
      {data.records.length ? data.records.map(r => <p className="mt-3 break-words text-sm" key={r.id}>{r.rail} · {r.status} · attempt {r.attempt_number} · {r.external_transaction_id ?? "No provider reference"}</p>) : <p className="mt-3 text-sm">No execution attempts returned. Settlement receipts below may record an external provider capture.</p>}
    </Card>
    <Card><SectionHeader title="Request, approval and settlement evidence" description="Matching receipts from this authority's audit trail."/>
      {data.receipts.length ? data.receipts.map(r => <details className="mt-3 border-t border-line pt-3 text-xs" key={r.id}><summary className="cursor-pointer">{r.event_type} · {formatDateTime(r.created_at)}</summary>
        <Link className="my-2 block underline" to={"/receipts?authority="+encodeURIComponent(t.authority_id)+"&receipt="+encodeURIComponent(r.id)}>Inspect {r.id}</Link>
        <pre className="overflow-auto whitespace-pre-wrap break-words">{JSON.stringify(r.payload,null,2)}</pre>
      </details>) : <p className="mt-3 text-sm">No matching receipt returned.</p>}
    </Card>
  </div>;
}


