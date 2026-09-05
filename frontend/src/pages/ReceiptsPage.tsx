import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/store";
import type { Receipt } from "../lib/types";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Skeleton } from "../components/primitives/Skeleton";
import { formatDateTime } from "../lib/format";
export function ReceiptsPage() {
  const { api }=useAuth();
  const [params]=useSearchParams();
  const authority=params.get("authority"); const selected=params.get("receipt");
  const [items,setItems]=useState<Receipt[]>([]);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  useEffect(() => {
    let active=true; setItems([]);setError("");
    if(!authority){setLoading(false);return;}
    setLoading(true);
    api.getAuthorityReceipts(authority).then(r => {if(active)setItems(r);})
      .catch(e => {if(active)setError(e instanceof Error?e.message:"Could not load receipts");}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[api,authority]);
  return <div className="mx-auto max-w-5xl space-y-5"><SectionHeader title="Receipts" description="Recorded decisions and settlement evidence, linked by receipt hashes."/>
    {!authority ? <Card><Link className="underline" to="/authorities">Select an authority to inspect its receipt chain</Link></Card> : loading ? <Skeleton lines={6}/> : error ? <Card><p role="alert">{error}</p></Card> :
      <><Link to={"/authorities/"+encodeURIComponent(authority)} className="text-xs underline">Back to authority</Link>
      {selected && !items.some(r=>r.id===selected) && <p role="alert">Selected receipt not found for this authority.</p>}
      {!items.length && <Card>No receipts returned.</Card>}
      {items.map(r=><Card key={r.id}><details open={r.id===selected || undefined}><summary className="cursor-pointer break-words text-sm">{r.event_type} · {formatDateTime(r.created_at)} · {r.id}</summary><dl className="my-3 break-all text-xs"><dt>Receipt hash</dt><dd>{r.receipt_hash}</dd><dt>Previous hash</dt><dd>{r.previous_hash ?? "First receipt"}</dd></dl><pre className="overflow-auto whitespace-pre-wrap break-words text-xs">{JSON.stringify(r.payload,null,2)}</pre></details></Card>)}</>}
  </div>;
}

