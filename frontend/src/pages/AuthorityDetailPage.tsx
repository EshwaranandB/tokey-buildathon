import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth, pushRecent } from "../lib/store";
import { formatMoney, formatDateTime, timeAgo, truncateMiddle } from "../lib/format";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { Skeleton } from "../components/primitives/Skeleton";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { Money } from "../components/primitives/Money";
import { AuthorityMeter } from "../components/financial/AuthorityMeter";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import type { Authority, Receipt } from "../lib/types";

export function AuthorityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { api, actor } = useAuth();
  const navigate = useNavigate();
  const [authority, setAuthority] = useState<Authority | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRevoke, setShowRevoke] = useState(false);
  const [reason, setReason] = useState("operator_revocation");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([api.getAuthority(id), api.getAuthorityReceipts(id)])
      .then(([a, r]) => {
        setAuthority(a);
        setReceipts(r);
        pushRecent({ id: a.id, kind: "authority", label: `${a.agent_id} · ${formatMoney(a.balance_micros, a.currency)}` });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load authority"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, api]);

  const revoke = async () => {
    if (!authority) return;
    setSubmitting(true);
    try {
      const updated = await api.revokeAuthority(authority.id, reason, true);
      setAuthority(updated);
      setShowRevoke(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Skeleton lines={8} />;
  if (error) return <Card><p className="text-sm text-danger">{error}</p></Card>;
  if (!authority) return <Card><p className="text-sm text-ink-faint">Authority not found.</p></Card>;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="tk-num truncate font-mono text-sm font-semibold text-ink">{authority.id}</h1>
              <Badge tone={authority.status === "ACTIVE" ? "ok" : "danger"} dot>{authority.status}</Badge>
              {authority.parent_id && <Badge tone="info">child of {truncateMiddle(authority.parent_id)}</Badge>}
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              agent <span className="text-ink-soft">{authority.agent_id}</span> · principal {authority.principal_id} · {authority.currency}
            </p>
          </div>
          {authority.status === "ACTIVE" && actor && ["OWNER", "ADMIN"].includes(actor.role) && (
            <Button variant="danger" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} onClick={() => setShowRevoke((v) => !v)}>
              Revoke
            </Button>
          )}
        </div>

        {showRevoke && (
          <div className="mt-4 rounded-md border border-danger-soft bg-danger-soft/40 p-3">
            <p className="flex items-center gap-1 text-xs font-medium text-danger-strong">
              <AlertTriangle className="h-3.5 w-3.5" /> Revoke this authority and its children. Core determines how in-flight reservations are handled.
            </p>
            <div className="mt-2 flex gap-2">
              <Input value={reason} onChange={(e) => setReason(e.target.value)} aria-label="Revocation reason" placeholder="reason" className="max-w-xs" />
              <Button variant="danger" size="sm" loading={submitting} onClick={revoke}>Confirm revoke</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowRevoke(false)}>Cancel</Button>
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs text-ink-soft">Balance</div>
            <Money micros={authority.balance_micros} currency={authority.currency} size="lg" />
          </div>
          <div>
            <div className="text-xs text-ink-soft">Reserved</div>
            <Money micros={authority.reserved_micros} currency={authority.currency} size="lg" tone="warn" />
          </div>
          <div>
            <div className="text-xs text-ink-soft">Available</div>
            <Money micros={authority.available_micros} currency={authority.currency} size="lg" tone="ok" />
          </div>
        </div>

        <div className="mt-4 max-w-md">
          <AuthorityMeter authority={authority} />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Scope" description="Constraints governing this authority." />
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Vendors</dt><dd className="text-ink">{authority.scope.vendors.join(", ")}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Purposes</dt><dd className="text-ink">{authority.scope.purposes.join(", ")}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Max transaction</dt><dd className="tk-num text-ink">{formatMoney(authority.scope.max_transaction_micros, authority.currency)}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Approval above</dt><dd className="tk-num text-ink">{authority.scope.approval_above_micros ? formatMoney(authority.scope.approval_above_micros, authority.currency) : "—"}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Delegation depth</dt><dd className="tk-num text-ink">{authority.scope.delegation_depth_remaining}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Expires</dt><dd className="tk-num text-ink">{formatDateTime(authority.scope.expires_at)}</dd></div>
        </dl>
      </Card>

      <Card>
        <SectionHeader title="Receipt chain" description={`Audit trail · head ${authority.receipt_head_hash ? truncateMiddle(authority.receipt_head_hash) : "none"}`} />
        {receipts.length === 0 ? (
          <p className="mt-2 text-xs text-ink-faint">No receipts yet.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {receipts.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-xs hover:bg-sunken">
                <Badge tone="neutral">{r.event_type.replace(/_/g, " ")}</Badge>
                <Link className="tk-num font-mono underline" to={"/receipts?authority=" + encodeURIComponent(authority.id) + "&receipt=" + encodeURIComponent(r.id)}>{truncateMiddle(r.id)}</Link>
                <span className="tk-num flex-1 truncate font-mono text-ink-faint">{truncateMiddle(r.receipt_hash)}</span>
                <span className="text-ink-faint">{timeAgo(r.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}


