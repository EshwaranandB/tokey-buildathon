import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatMoneyExact } from "../lib/format";
import { useAuth } from "../lib/store";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { Skeleton } from "../components/primitives/Skeleton";
import { EmptyState } from "../components/primitives/EmptyState";
import { Button } from "../components/primitives/Button";
import { Check, X, CheckSquare, AlertTriangle } from "lucide-react";
import { formatAgentName } from "../lib/presentation";
import { ApprovalTrace } from "../components/beautiful/ApprovalTrace";

export function ApprovalsPage() {
  const { api, actor } = useAuth();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.dashboardApprovals().then((result) => {setPending(result.items);setError(null);}).catch(() => {setPending([]);setError("Could not load approvals.");}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [api]);

  const decide = async (id: string, approved: boolean) => {
    setBusyId(id);
    setError(null);
    try {
      await api.decideApproval(id, approved, actor?.actor_id ?? "operator");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decision failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <SectionHeader title="Approvals" description="Spend requests awaiting operator decision. Tokey surfaces REQUIRE_APPROVAL decisions here." />

      {loading ? (
        <Skeleton lines={4} />
      ) : error && pending.length === 0 ? null : pending.length === 0 ? (
        <EmptyState icon={<CheckSquare className="h-5 w-5" />} title="No pending approvals" description="All evaluated spend requests have been decided. New approvals appear automatically when a request exceeds the authority's approval threshold." />
      ) : (
        <div className="space-y-2">
          {pending.map((p) => (
            <Card key={p.spend_request_id} padding="sm" className="space-y-3">
              <ApprovalTrace active={1} />
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warn" dot>Approval required</Badge>
                <span className="flex-1 text-xs text-ink">{formatMoneyExact(p.amount_micros, p.currency)} · {formatAgentName(p.agent_id)} · {p.vendor} · {p.purpose} · <Link className="underline" to={"/transactions/" + encodeURIComponent(p.spend_request_id)}>Inspect request</Link></span>
                {actor && ["OWNER", "ADMIN"].includes(actor.role) && <><Button variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5" />} loading={busyId === p.spend_request_id} onClick={() => decide(p.spend_request_id, false)}>Deny</Button>
                <Button variant="primary" size="sm" icon={<Check className="h-3.5 w-3.5" />} loading={busyId === p.spend_request_id} onClick={() => decide(p.spend_request_id, true)}>Approve</Button></>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card padding="sm" className="border-danger-soft bg-danger-soft/40">
          <p className="flex items-center gap-1 text-xs text-danger-strong"><AlertTriangle className="h-3.5 w-3.5" />{error}</p>
        </Card>
      )}
    </div>
  );
}

