import { useEffect, useState } from "react";
import { useAuth } from "../lib/store";
import { Card, SectionHeader } from "../components/primitives/Card";
import { Badge } from "../components/primitives/Badge";
import { Skeleton } from "../components/primitives/Skeleton";
import { EmptyState } from "../components/primitives/EmptyState";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { KeyRound, Plus, Copy, Check, AlertTriangle } from "lucide-react";
import type { CredentialInfo, CredentialCreated } from "../lib/types";
import { formatDateTime } from "../lib/format";

export function SettingsPage() {
  const { api, actor, mock, signOut } = useAuth();
  const [credentials, setCredentials] = useState<CredentialInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMint, setShowMint] = useState(false);
  const [minted, setMinted] = useState<CredentialCreated | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api.listCredentials().then(setCredentials).catch(() => setCredentials([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [api]);

  const mint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMinted(null);
    const form = new FormData(e.currentTarget);
    const role = String(form.get("role") || "AGENT");
    const name = String(form.get("name") || "");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.createCredential({
        role,
        name,
        agent_id: role === "AGENT" ? String(form.get("agent_id") || name.trim().toLowerCase().replace(/\s+/g, "-")) : null,
        ttl_minutes: form.get("ttl_minutes") ? Number(form.get("ttl_minutes")) : null,
      });
      setMinted(result);
      setShowMint(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mint credential");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredential = async () => {
    if (!minted?.credential) return;
    try {
      await navigator.clipboard.writeText(minted.credential);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <SectionHeader
        title="Settings"
        description="Workspace identity, security posture, and developer access."
        action={
          actor?.role === "OWNER" && (
            <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => { setShowMint((v) => !v); setMinted(null); }}>
              Mint credential
            </Button>
          )
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        <Card padding="sm"><SectionHeader title="Workspace" description="Current authenticated workspace." /><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between gap-4"><dt className="text-ink-3">Workspace ID</dt><dd className="font-mono text-ink">{actor?.tenant_id ?? "—"}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-3">Environment</dt><dd className="text-ink">Development</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-3">Default currency</dt><dd className="text-ink">Defined by authority</dd></div></dl></Card>
        <Card padding="sm"><SectionHeader title="Security" description="Credential and session controls." /><dl className="mt-3 space-y-2 text-xs"><div className="flex justify-between gap-4"><dt className="text-ink-3">Dashboard session</dt><dd className="text-ink">Secure cookie + CSRF</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-3">Credentials</dt><dd className="text-ink">Hashed at rest</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-3">Role</dt><dd className="font-medium text-ink">{actor?.role ?? "—"}</dd></div></dl></Card>
      </div>

      {mock && (
        <Card padding="sm" className="border-warn-soft/60 bg-warn-soft/40">
          <p className="text-xs text-warn-strong">
            <strong>Demo mode.</strong> Credential minting is simulated. No real credentials are created.
          </p>
        </Card>
      )}

      {minted && (
        <Card padding="sm" className="border-info-soft bg-info-soft/40">
          <p className="flex items-center gap-1 text-xs font-medium text-info-strong">
            <AlertTriangle className="h-3.5 w-3.5" /> Credential shown ONCE. Copy it now — it cannot be retrieved again.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="tk-num flex-1 truncate rounded bg-surface px-2 py-1 font-mono text-xs text-ink">{minted.credential}</code>
            <Button variant="secondary" size="sm" icon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} onClick={copyCredential}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="mt-1 text-[10px] text-ink-faint">
            role {minted.role} · actor {minted.actor_id} · expires {formatDateTime(minted.expires_at)}
          </div>
        </Card>
      )}

      {showMint && (
        <Card>
          <form onSubmit={mint} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-ink-soft">Role</label>
              <select name="role" defaultValue="AGENT" className="h-8 w-full rounded-md border border-line bg-surface px-2 text-xs text-ink">
                <option value="AGENT">AGENT</option>
                <option value="ADMIN">ADMIN</option>
                <option value="VIEWER">VIEWER</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-soft">Name</label>
              <Input name="name" placeholder="e.g. shopping-agent" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-soft">Agent ID (AGENT only)</label>
              <Input name="agent_id" placeholder="defaults to name" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-ink-soft">TTL (minutes, optional)</label>
              <Input name="ttl_minutes" type="number" placeholder="no expiry" />
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" variant="primary" size="sm" loading={submitting}>Mint</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowMint(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <SectionHeader title="Credentials" description="Active and revoked credentials. Secrets are never stored or displayed." />
        {loading ? (
          <Skeleton lines={4} />
        ) : credentials.length === 0 ? (
          <EmptyState icon={<KeyRound className="h-5 w-5" />} title="No credentials" description="Mint a credential to provision an agent, admin, or viewer." />
        ) : (
          <ul className="divide-y divide-line">
            {credentials.map((c) => (
              <li key={c.credential_id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="tk-num truncate font-mono text-xs text-ink">{c.credential_id}</span>
                    <span className="tk-num text-[10px] text-ink-faint">{c.key_prefix}</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-ink-faint">
                    created {formatDateTime(c.created_at)} · expires {formatDateTime(c.expires_at)}
                  </div>
                </div>
                <Badge tone={c.revoked ? "danger" : "ok"} dot>{c.revoked ? "revoked" : "active"}</Badge>
                {!c.revoked && actor?.role === "OWNER" && (
                  <Button variant="ghost" size="sm" onClick={() => api.revokeCredential(c.credential_id).then(load)}>
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionHeader title="Session" description="Current operator session." />
        <dl className="mt-2 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2">
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Actor ID</dt><dd className="tk-num font-mono text-ink">{actor?.actor_id}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Tenant</dt><dd className="tk-num text-ink">{actor?.tenant_id}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Role</dt><dd className="text-ink">{actor?.role}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-ink-faint">Mode</dt><dd className="text-ink">{mock ? "demo" : "live"}</dd></div>
        </dl>
        <div className="mt-3">
          <Button variant="secondary" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </Card>
    </div>
  );
}


