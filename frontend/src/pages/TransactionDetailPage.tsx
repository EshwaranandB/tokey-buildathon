import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, pushRecent } from "../lib/store";
import { timeAgo, truncateMiddle } from "../lib/format";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { Skeleton } from "../components/primitives/Skeleton";
import { Button } from "../components/primitives/Button";
import { Money } from "../components/primitives/Money";
import { AlertTriangle, ArrowLeft, Play, RotateCcw } from "lucide-react";
import type { Reservation, ExecutionRecord } from "../lib/types";

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { api } = useAuth();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [execRecords, setExecRecords] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    api
      .getReservation(id)
      .then((r) => {
        setReservation(r);
        pushRecent({ id: r.id, kind: "reservation" });
        return api.getExecutionRecords(r.id);
      })
      .then((recs) => setExecRecords(recs))
      .catch(() => {
        api
          .getExecutionRecord(id)
          .then((rec) => {
            setExecRecords([rec]);
            pushRecent({ id: rec.id, kind: "execution_record" });
          })
          .catch(() => setError("No spend request, reservation, or execution record found for this ID."));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, api]);

  const execute = async () => {
    if (!reservation) return;
    setBusy(true);
    try {
      const spendId = reservation.spend_request_id;
      const auth = await api.createExecutionAuth(spendId);
      const outcome = await api.executeV2(reservation.id, auth.id, { mock_outcome: "SUCCESS" });
      setReservation(outcome.reservation);
      setExecRecords((prev) => [outcome.record, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setBusy(false);
    }
  };

  const reconcile = async () => {
    if (!reservation) return;
    setBusy(true);
    try {
      const outcome = await api.reconcile(reservation.id, { mock_outcome: "SUCCESS" });
      setReservation(outcome.reservation);
      setExecRecords((prev) => [outcome.record, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reconciliation failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Skeleton lines={8} />;
  if (error && !reservation && execRecords.length === 0) return <Card><p className="text-sm text-danger">{error}</p></Card>;

  const decisionTone = (d: string) =>
    d === "ALLOW_RESERVED" || d === "CAPTURED" ? "ok" : d === "RELEASED" ? "danger" : d === "UNKNOWN" ? "mystery" : "neutral";

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      {reservation && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="tk-num truncate font-mono text-sm font-semibold text-ink">{reservation.id}</h1>
                <Badge tone={decisionTone(reservation.status) as "ok" | "warn" | "danger" | "mystery" | "neutral"} dot>{reservation.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-faint">
                spend <span className="tk-num font-mono">{truncateMiddle(reservation.spend_request_id)}</span> · authority {truncateMiddle(reservation.authority_id)}
              </p>
            </div>
            <Money micros={reservation.amount_micros} currency={reservation.currency} size="lg" />
          </div>

          {reservation.status === "ACTIVE" && (
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="sm" icon={<Play className="h-3.5 w-3.5" />} loading={busy} onClick={execute}>Execute</Button>
            </div>
          )}
          {reservation.status === "UNKNOWN" && (
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />} loading={busy} onClick={reconcile}>Reconcile</Button>
            </div>
          )}
        </Card>
      )}

      {execRecords.length > 0 && (
        <Card>
          <SectionHeader title="Execution records" description="Attempts to finalize this reservation." />
          <ul className="mt-3 space-y-1.5">
            {execRecords.map((rec) => (
              <li key={rec.id} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-xs hover:bg-sunken">
                <Badge tone={rec.status === "EXECUTED" ? "ok" : rec.status === "FAILED" ? "danger" : "mystery"} dot>{rec.status}</Badge>
                <span className="tk-num font-mono text-ink-faint">{truncateMiddle(rec.id)}</span>
                <span className="text-ink-faint">attempt {rec.attempt_number}</span>
                {rec.external_transaction_id && <span className="tk-num font-mono text-ink-faint">ext {truncateMiddle(rec.external_transaction_id)}</span>}
                {rec.error_message && <span className="flex items-center gap-1 text-danger"><AlertTriangle className="h-3 w-3" />{rec.error_message}</span>}
                <span className="ml-auto text-ink-faint">{timeAgo(rec.executed_at)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {error && (
        <Card padding="sm" className="border-danger-soft bg-danger-soft/40">
          <p className="flex items-center gap-1 text-xs text-danger-strong"><AlertTriangle className="h-3.5 w-3.5" />{error}</p>
        </Card>
      )}
    </div>
  );
}


