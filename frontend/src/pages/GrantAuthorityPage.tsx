import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/store";
import { positiveMicros, scopeValues } from "../lib/authorityInput";
import { formatMoneyExact } from "../lib/format";
import type { NewRootAuthorityInput } from "../lib/types";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Input } from "../components/primitives/Input";
import { Button } from "../components/primitives/Button";

export function GrantAuthorityPage() {
  const { api, actor } = useAuth();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<NewRootAuthorityInput | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!actor || !["OWNER", "ADMIN"].includes(actor.role)) return <Card>Only an owner or admin can grant authority.</Card>;
  const review = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError("");
    try {
      const data = new FormData(event.currentTarget);
      const get = (name: string) => String(data.get(name) ?? "").trim();
      const amount = positiveMicros(get("budget"));
      const maximum = positiveMicros(get("maximum"));
      const threshold = get("threshold") ? positiveMicros(get("threshold")) : null;
      if (maximum > amount) throw new Error("Transaction limit cannot exceed the granted budget.");
      const expires = new Date(get("expires"));
      if (!Number.isFinite(expires.getTime()) || expires.getTime() <= Date.now()) throw new Error("Choose a future expiry.");
      setDraft({ tenant_id: actor.tenant_id, principal_id: get("principal"), agent_id: get("agent"),
        currency: get("currency").toUpperCase(), amount_micros: amount, idempotency_key: crypto.randomUUID(),
        scope: { vendors: scopeValues(get("vendors")), purposes: scopeValues(get("purposes")),
          resource_types: scopeValues(get("resources")), rails: scopeValues(get("rails")),
          max_transaction_micros: maximum, approval_above_micros: threshold,
          expires_at: expires.toISOString(), delegation_depth_remaining: 0 } });
    } catch (e) { setError(e instanceof Error ? e.message : "Invalid authority"); }
  };
  const create = async () => {
    if (!draft || busy) return;
    setBusy(true); setError("");
    try { const authority = await api.createRootAuthority(draft); navigate("/authorities/" + encodeURIComponent(authority.id)); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not grant authority. Retry keeps the same request key."); }
    finally { setBusy(false); }
  };
  return <div className="mx-auto max-w-3xl space-y-5">
    <Link className="text-xs underline" to="/authorities">Back to authorities</Link>
    <SectionHeader title="Grant authority" description="Define what an agent may spend. Core enforces this mandate on every request." />
    <p className="text-xs text-ink-3">Use the agent ID from its provisioned credential. <Link to="/settings" className="underline">Identify / provision an agent</Link>. A grant authorizes spending; it does not deposit money.</p>
    {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    <form onSubmit={review} hidden={draft !== null}>
      <Card><div className="grid gap-4 sm:grid-cols-2">
        {[["agent","Agent ID","text"],["principal","Principal / organization ID","text"],["currency","Currency code","text"],
          ["budget","Budget (currency units)","text"],["vendors","Merchants (comma separated)","text"],
          ["purposes","Purposes (comma separated)","text"],["resources","Resource types (comma separated)","text"],
          ["rails","Rails (comma separated)","text"],["maximum","Maximum per transaction","text"],
          ["threshold","Approval above (blank = no threshold)","text"],["expires","Expires at (local time)","datetime-local"]].map(([name,label,type]) =>
          <label key={name} className="space-y-1 text-xs text-ink-2">{label}<Input name={name} type={type} required={name !== "threshold"} defaultValue={name === "currency" ? "INR" : undefined} pattern={name === "currency" ? "[A-Za-z]{3}" : undefined} /></label>)}
      </div><p className="my-4 text-xs text-ink-3">Scopes use exact values. An explicit * allows any value. Delegation is disabled for this grant.</p><Button type="submit" variant="primary">Review mandate</Button></Card>
    </form>
    {draft && <Card><SectionHeader title="Review mandate" description="Confirm the financial boundaries before issuing authority." />
      <dl className="my-4 space-y-2 text-sm">
        {[["Agent",draft.agent_id],["Principal",draft.principal_id],["Budget",formatMoneyExact(draft.amount_micros,draft.currency)],
          ["Merchants",draft.scope.vendors.join(", ")],["Purposes",draft.scope.purposes.join(", ")],
          ["Resources",draft.scope.resource_types.join(", ")],["Rails",draft.scope.rails.join(", ")],
          ["Maximum transaction",formatMoneyExact(draft.scope.max_transaction_micros,draft.currency)],
          ["Approval above",draft.scope.approval_above_micros === null ? "No threshold — permitted requests may proceed autonomously" : formatMoneyExact(draft.scope.approval_above_micros,draft.currency)],
          ["Expires",new Date(draft.scope.expires_at).toLocaleString()]].map(([key,value]) => <div key={key}><dt className="text-ink-3">{key}</dt><dd className="break-words">{value}</dd></div>)}
      </dl><div className="flex gap-2"><Button variant="primary" loading={busy} onClick={create}>Create authority</Button><Button disabled={busy} onClick={() => {setDraft(null);setError("");}}>Edit</Button></div>
    </Card>}
  </div>;
}

