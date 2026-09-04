import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ApiError, makeLiveClient } from "./api";
import type { ApiClient } from "./api";
import type { Actor, RecentRef, RefKind } from "./types";

const RECENT_KEY = "tokey.recent.v1";
const MAX_RECENT = 60;

interface AuthState {
  /** null until verified — the console treats credential verification as the session. */
  actor: Actor | null;
  checking: boolean;
  error: string | null;
  mock: boolean;
  api: ApiClient;
  signIn: (token: string) => Promise<Actor>;
  signInMock: () => void;
  signOut: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const mock = false;
  const [actor, setActor] = useState<Actor | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = useMemo<ApiClient>(
    () => makeLiveClient(),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    setChecking(true);
    api
      .dashboardSession()
      .then((a) => {
        if (!cancelled) setActor(a);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          setActor(null);
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : "Failed to reach Tokey Core.");
          setActor(null);
        }
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const signIn = useCallback(
    async (candidate: string) => {
      const trimmed = candidate.trim();
      if (!trimmed) throw new ApiError(0, "Paste a Tokey credential (tokey_…).");
      const verified = await api.createDashboardSession(trimmed);
      setActor(verified);
      setError(null);
      return verified;
    },
    [api],
  );

  const signInMock = useCallback(() => {
    setError("Demo mode is disabled. Sign in to a real Tokey Core session.");
  }, []);

  const signOut = useCallback(() => {
    api.logoutDashboardSession().catch(() => undefined).finally(() => setActor(null));
  }, [api]);

  const value = useMemo<AuthState>(
    () => ({
      actor,
      checking,
      error,
      mock,
      api,
      signIn,
      signInMock,
      signOut,
      clearError: () => setError(null),
    }),
    [actor, checking, error, mock, api, signIn, signInMock, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Recent-activity registry (frontend-owned; the backend has no list endpoints,
// so the console remembers every entity you touch — never sent anywhere).
// ---------------------------------------------------------------------------

function readRecent(): RecentRef[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentRef[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function pushRecent(ref: { id: string; kind: RefKind; label?: string }): void {
  try {
    const list = readRecent().filter((r) => r.id !== ref.id);
    list.unshift({ ...ref, at: Date.now() });
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
    window.dispatchEvent(new Event("tokey:recent"));
  } catch {
    /* storage unavailable — registry is best-effort */
  }
}

export function clearRecent(): void {
  try {
    localStorage.removeItem(RECENT_KEY);
    window.dispatchEvent(new Event("tokey:recent"));
  } catch {
    /* ignore */
  }
}

export function useRecent(): RecentRef[] {
  const [list, setList] = useState<RecentRef[]>(readRecent);
  useEffect(() => {
    const update = () => setList(readRecent());
    window.addEventListener("tokey:recent", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("tokey:recent", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return list;
}
