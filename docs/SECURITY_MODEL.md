# Tokey security model

```text
credential
    ↓
authenticated actor
    ↓
tenant boundary + role authorization
    ↓
economic authority evaluation
    ↓
reservation
    ↓
context-bound execution authorization
    ↓
provider execution
    ↓
trusted settlement evidence
    ↓
financial finality
```

## Public guarantees

- Identity is derived from an authenticated Tokey credential, not supplied by an agent request.
- Agent credentials are bound to their provisioned agent identity.
- Tenant boundaries and role permissions gate every operation.
- Authorities bound budgets, merchants, purposes, resource types, rails, transaction limits, approval thresholds, and expiry.
- Requests fail closed when policy does not permit them.
- Reservations protect approved economic capacity before execution.
- Execution requires a context-bound authorization; raw execution is not an agent bypass path.
- Revocation, idempotency, and audit receipts are first-class control-plane concerns.
- Provider settlement evidence is verified before a financial state becomes final.

## Deliberate disclosure boundary

This document describes security properties and integration contracts. It does not disclose signing material, credential values, key derivation, verifier internals, persistence topology, concurrency controls, or private adversarial test implementation.
