import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ArrowRight, Play, AlertTriangle, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../lib/store";
import { Button } from "../components/primitives/Button";
import { Input } from "../components/primitives/Input";
import { Card } from "../components/primitives/Card";
import { ContextCards } from "../components/beautiful/ContextCards";
import { ToolChips } from "../components/beautiful/ToolChips";

export function SignInPage() {
  const { signIn, signInMock, error, clearError } = useAuth();
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    clearError();
    try {
      await signIn(token);
      navigate("/");
    } catch (err) {
      // error surfaced via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-canvas px-4 py-8 sm:flex sm:items-center sm:justify-center">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="space-y-5">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-surface">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">Tokey</div>
            <div className="text-xs text-ink-faint">Economic Authority Console</div>
          </div>
        </div>

          <div className="max-w-md space-y-3"><span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-2"><Sparkles className="h-3.5 w-3.5" /> Economic control plane</span><h1 className="text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl">Give agents a mandate. Keep the money under control.</h1><p className="text-[14px] leading-relaxed text-ink-2">Tokey evaluates each spend against a signed authority, requires a human when policy says so, and records the resulting evidence.</p></div>
          <ToolChips /><ContextCards />
        </section>
        <section className="w-full max-w-md lg:justify-self-end"><div className="mb-3 flex items-center gap-2 text-[12px] font-medium text-ink-2"><ShieldCheck className="h-3.5 w-3.5 text-ok" /> Credential-gated console</div><Card className="shadow-raised">
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Operator credential</label>
              <Input
                autoFocus
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="tokey_cred_…"
                error={Boolean(error)}
              />
              {error && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger">
                  <AlertTriangle className="h-3 w-3" />
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full" icon={<ArrowRight className="h-4 w-4" />}>
              Enter console
            </Button>
          </form>
        </Card>

        <div className="mt-3 flex items-center justify-between text-xs text-ink-faint">
          <span>Paste any Tokey Core credential to begin a session.</span>
          <button onClick={signInMock} className="flex items-center gap-1 text-ink-soft hover:text-ink">
            <Play className="h-3 w-3" /> Try demo
          </button>
        </div>
        </section>
      </div>
    </div>
  );
}

