/**
 * Types mirroring Tokey Core's REST contract (app/main.py response serializers).
 * Do not invent fields — these are the actual API shapes.
 */

export type Role = "OWNER" | "ADMIN" | "AGENT" | "VIEWER";

export interface Actor {
  actor_id: string;
  tenant_id: string;
  role: Role;
  agent_id: string | null;
}

export interface Scope {
  vendors: string[];
  purposes: string[];
  resource_types: string[];
  rails: string[];
  max_transaction_micros: number;
  approval_above_micros: number | null;
  expires_at: string;
  delegation_depth_remaining: number;
}

export type AuthorityStatus = "ACTIVE" | "REVOKED" | "EXPIRED" | (string & {});

export interface Authority {
  id: string;
  tenant_id: string;
  principal_id: string;
  agent_id: string;
  parent_id: string | null;
  currency: string;
  balance_micros: number;
  reserved_micros: number;
  available_micros: number;
  status: AuthorityStatus;
  scope: Scope;
  policy_version: number;
  receipt_head_hash: string | null;
  granted_micros?: number;
  captured_micros?: number;
  created_at?: string;
  revoked_at?: string | null;
}

export type SpendDecision = "ALLOW_RESERVED" | "REQUIRE_APPROVAL" | "DENY" | (string & {});

export interface SpendRequestResult {
  id: string;
  decision: SpendDecision;
  reason_codes: string[];
  reservation_id: string | null;
  context_hash: string | null;
  policy_version: number;
}

export type ReservationStatus =
  | "ACTIVE"
  | "EXECUTING"
  | "CAPTURED"
  | "RELEASED"
  | "UNKNOWN"
  | (string & {});

export interface Reservation {
  id: string;
  tenant_id: string;
  spend_request_id: string;
  authority_id: string;
  amount_micros: number;
  currency: string;
  status: ReservationStatus;
  external_ref: string | null;
  finalized_at: string | null;
}

export interface ExecutionAuthorization {
  id: string;
  authority_id: string;
  spend_request_id: string;
  reservation_id: string;
  agent_id: string;
  amount_micros: number;
  currency: string;
  vendor: string;
  purpose: string;
  resource_type: string;
  rail: string;
  request_fingerprint: string;
  issued_at: string;
  expires_at: string;
  status: string;
  used_at: string | null;
}

export type ExecutionRecordStatus =
  | "EXECUTED"
  | "FAILED"
  | "UNKNOWN"
  | (string & {});

export interface ExecutionRecord {
  id: string;
  reservation_id: string;
  execution_authorization_id: string | null;
  rail: string;
  adapter: string;
  attempt_number: number;
  status: ExecutionRecordStatus;
  external_transaction_id: string | null;
  error_category: string | null;
  error_message: string | null;
  executed_at: string | null;
  settled_at: string | null;
}

export interface Receipt {
  id: string;
  authority_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  previous_hash: string | null;
  receipt_hash: string;
  created_at: string;
}

export interface CredentialInfo {
  credential_id: string;
  key_prefix: string;
  created_at: string;
  expires_at: string | null;
  revoked: boolean;
}

/** OWNER mints: secret is returned exactly once. */
export interface CredentialCreated {
  tenant_id: string;
  actor_id: string;
  role: Role;
  agent_id: string | null;
  expires_at: string | null;
  credential: string;
}

export interface BootstrapResult {
  tenant_id: string;
  actor_id: string;
  role: Role;
  credential: string;
}

/** Local recent-activity registry (frontend-owned; backend has no list endpoints). */
export type RefKind = "authority" | "spend" | "reservation" | "receipt" | "execution_auth" | "execution_record";

export interface RecentRef {
  id: string;
  kind: RefKind;
  label?: string;
  at: number;
}

export interface NewSpendInput {
  authority_id: string;
  agent_id: string;
  external_request_id: string;
  amount_micros: number;
  currency: string;
  vendor: string;
  purpose: string;
  resource_type: string;
  rail: string;
}

export interface NewRootAuthorityInput {
  tenant_id: string;
  principal_id: string;
  agent_id: string;
  currency: string;
  amount_micros: number;
  scope: Scope;
  idempotency_key: string;
}

export interface DelegateInput {
  child_agent_id: string;
  amount_micros: number;
  scope: Scope;
  idempotency_key: string;
}
