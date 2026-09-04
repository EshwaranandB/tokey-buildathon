import type { RefKind } from "./types";

/** Real ID prefixes minted by Tokey Core (app/service.py, app/execution_service.py, app/signers.py). */
const PREFIXES: Array<{ prefix: string; kind: RefKind }> = [
  { prefix: "auth_", kind: "authority" },
  { prefix: "res_", kind: "reservation" },
  { prefix: "rcpt_", kind: "receipt" },
  { prefix: "spend_", kind: "spend" },
  { prefix: "exauth_", kind: "execution_auth" },
  { prefix: "exrec_", kind: "execution_record" },
];

export function detectRefKind(id: string): RefKind | null {
  const value = id.trim();
  if (!value) return null;
  const match = PREFIXES.find((p) => value.startsWith(p.prefix));
  return match ? match.kind : null;
}

export const KIND_LABEL: Record<RefKind, string> = {
  authority: "Authority",
  spend: "Spend request",
  reservation: "Reservation",
  receipt: "Receipt",
  execution_auth: "Execution authorization",
  execution_record: "Execution record",
};

/** Suggested random idempotency key for state-changing forms. */
export function newIdempotencyKey(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** External request id for spend requests (operator can override). */
export function newExternalRequestId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return `web-${Date.now().toString(36)}-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}
