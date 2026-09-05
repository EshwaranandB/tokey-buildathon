import type {
  Actor,
  Authority,
  BootstrapResult,
  CredentialCreated,
  CredentialInfo,
  ExecutionAuthorization,
  ExecutionRecord,
  NewRootAuthorityInput,
  NewSpendInput,
  Receipt,
  Reservation,
  SpendRequestResult,
  DelegateInput,
} from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly detail: string;
  /** 503 = transaction contention; the same idempotent request may be retried. */
  readonly retryable: boolean;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
    this.retryable = status === 503;
  }
}

export interface ExecOutcome {
  record: ExecutionRecord;
  reservation: Reservation;
}

/** The single frontend↔backend contract. Mock mode implements this too. */
export interface ApiClient {
  health(): Promise<{ ok: boolean; service: string; version: string }>;
  createDashboardSession(credential: string): Promise<Actor>;
  dashboardSession(): Promise<Actor>;
  logoutDashboardSession(): Promise<void>;
  dashboardSummary(): Promise<any>;
  dashboardAuthorities(): Promise<any>;
  dashboardApprovals(): Promise<any>;
  dashboardTransactions(limit?: number, offset?: number): Promise<any>;
  me(): Promise<Actor>;
  bootstrapOwner(tenantId: string | null, ownerName: string): Promise<BootstrapResult>;
  listCredentials(): Promise<CredentialInfo[]>;
  createCredential(input: { role: string; name: string; agent_id?: string | null; ttl_minutes?: number | null }): Promise<CredentialCreated>;
  revokeCredential(credentialId: string): Promise<{ credential_id: string; revoked: boolean }>;

  createRootAuthority(input: NewRootAuthorityInput): Promise<Authority>;
  getAuthority(id: string): Promise<Authority>;
  getAuthorityTree(id: string): Promise<Authority[]>;
  getAuthorityReceipts(id: string): Promise<Receipt[]>;
  delegateAuthority(id: string, input: DelegateInput): Promise<Authority>;
  revokeAuthority(id: string, reason: string, cascade: boolean): Promise<Authority>;

  createSpend(input: NewSpendInput): Promise<SpendRequestResult>;
  decideApproval(spendRequestId: string, approved: boolean, decidedBy: string): Promise<SpendRequestResult>;
  createExecutionAuth(spendRequestId: string): Promise<ExecutionAuthorization>;
  getExecutionAuth(id: string): Promise<ExecutionAuthorization>;

  getReservation(id: string): Promise<Reservation>;
  getExecutionRecords(reservationId: string): Promise<ExecutionRecord[]>;
  executeV2(reservationId: string, executionAuthorizationId: string, adapterPayload: Record<string, unknown>): Promise<ExecOutcome>;
  reconcile(reservationId: string, adapterPayload: Record<string, unknown>): Promise<ExecOutcome>;
  submitProviderEvidence(reservationId: string, rail: string | null, providerEvidence: Record<string, unknown>): Promise<unknown>;
  bindProviderReference(reservationId: string, rail: string, providerOrderId: string): Promise<unknown>;

  getReceipt(id: string): Promise<Receipt>;
  getExecutionRecord(id: string): Promise<ExecutionRecord>;
}

export function makeLiveClient(_legacyTokenReader?: () => string | null): ApiClient {
  const base = (import.meta.env.VITE_TOKEY_API_URL || "").replace(/\/+$/, "");

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (!["GET", "HEAD"].includes(method)) {
      const csrf = document.cookie.split("; ").find((value) => value.startsWith("tokey_dashboard_csrf="))?.split("=")[1];
      if (csrf) headers["X-Tokey-CSRF"] = decodeURIComponent(csrf);
    }

    let res: Response;
    try {
      res = await fetch(base + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: "include",
      });
    } catch {
      throw new ApiError(0, "network error — is the Tokey Core backend running?");
    }

    if (!res.ok) {
      let detail = `${res.status} ${res.statusText}`;
      try {
        const data = (await res.json()) as { detail?: string };
        if (data && typeof data.detail === "string") detail = data.detail;
      } catch {
        /* non-JSON error body */
      }
      throw new ApiError(res.status, detail);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  const enc = encodeURIComponent;

  return {
    health: () => request("GET", "/health"),
    createDashboardSession: (credential) => request("POST", "/v1/dashboard/session", { credential }),
    dashboardSession: () => request("GET", "/v1/dashboard/session"),
    logoutDashboardSession: () => request("DELETE", "/v1/dashboard/session"),
    dashboardSummary: () => request("GET", "/v1/dashboard/summary"),
    dashboardAuthorities: () => request("GET", "/v1/dashboard/authorities"),
    dashboardApprovals: () => request("GET", "/v1/dashboard/approvals"),
    dashboardTransactions: (limit = 50, offset = 0) => request("GET", `/v1/dashboard/transactions?limit=${limit}&offset=${offset}`),
    me: () => request("GET", "/v1/auth/me"),
    bootstrapOwner: (tenantId, ownerName) =>
      request("POST", "/v1/auth/bootstrap-owner", { tenant_id: tenantId || null, owner_name: ownerName || "owner" }),
    listCredentials: () =>
      request("GET", "/v1/auth/credentials").then((d) => (d as { credentials: CredentialInfo[] }).credentials),
    createCredential: (input) => request("POST", "/v1/auth/credentials", input),
    revokeCredential: (credentialId) => request("DELETE", `/v1/auth/credentials/${enc(credentialId)}`),

    createRootAuthority: (input) => request("POST", "/v1/authorities", input),
    getAuthority: (id) => request("GET", `/v1/authorities/${enc(id)}`),
    getAuthorityTree: (id) => request("GET", `/v1/authorities/${enc(id)}/tree`),
    getAuthorityReceipts: (id) => request("GET", `/v1/authorities/${enc(id)}/receipts`),
    delegateAuthority: (id, input) => request("POST", `/v1/authorities/${enc(id)}/delegate`, input),
    revokeAuthority: (id, reason, cascade) =>
      request("POST", `/v1/authorities/${enc(id)}/revoke`, { reason, cascade }),

    createSpend: (input) => request("POST", "/v1/spend-requests", input),
    decideApproval: (spendRequestId, approved, decidedBy) =>
      request("POST", `/v1/spend-requests/${enc(spendRequestId)}/approval`, { approved, decided_by: decidedBy }),
    createExecutionAuth: (spendRequestId) =>
      request("POST", `/v1/spend-requests/${enc(spendRequestId)}/execution-authorization`, {}),
    getExecutionAuth: (id) => request("GET", `/v1/execution-authorizations/${enc(id)}`),

    getReservation: (id) => request("GET", `/v1/reservations/${enc(id)}`),
    getExecutionRecords: (reservationId) => request("GET", `/v1/reservations/${enc(reservationId)}/execution-records`),
    executeV2: (reservationId, executionAuthorizationId, adapterPayload) =>
      request("POST", `/v1/reservations/${enc(reservationId)}/execute-v2`, {
        execution_authorization_id: executionAuthorizationId,
        adapter_payload: adapterPayload,
      }),
    reconcile: (reservationId, adapterPayload) =>
      request("POST", `/v1/reservations/${enc(reservationId)}/reconcile`, { adapter_payload: adapterPayload }),
    submitProviderEvidence: (reservationId, rail, providerEvidence) =>
      request("POST", `/v1/reservations/${enc(reservationId)}/settlement-evidence`, {
        rail: rail ?? null,
        provider_evidence: providerEvidence,
      }),
    bindProviderReference: (reservationId, rail, providerOrderId) =>
      request("POST", `/v1/reservations/${enc(reservationId)}/provider-reference`, {
        rail,
        provider_order_id: providerOrderId,
      }),

    getReceipt: (id) => request("GET", `/v1/receipts/${enc(id)}`),
    getExecutionRecord: (id) => request("GET", `/v1/execution-records/${enc(id)}`),
  };
}

