# Tokey

### Enforceable financial authority for autonomous AI agents

Tokey gives companies enforceable spending mandates for AI agents. It authorizes, blocks, or escalates agent-initiated purchases across payment rails—and produces a verifiable receipt for every completed decision.

An agent can decide what it wants to buy. Tokey decides whether it is allowed to spend.

> **Buildathon result:** a governed **₹1,799 INR** purchase completed through Razorpay Test Mode, moved through human approval and reserved authority, and reached `CAPTURED` only after Tokey verified provider evidence. Test Mode uses simulated funds; no real money moved.

## Why Tokey exists

Giving an AI agent a payment credential answers *how can it pay?* It does not answer the harder questions:

- Which agent is acting, and for which organization?
- What may it buy, from whom, and for what purpose?
- How much may it spend, per purchase and in total?
- When must a human approve the request?
- Can approval be replayed, exceeded, or used for a different purchase?
- How does the organization know the provider actually settled it?

Tokey is the control plane between agent intent and financial execution. The model proposes an action; deterministic policy and authenticated authority govern the money.

## How it works

```text
Telegram / application / autonomous workflow
                     │
                     ▼
            Agent runtime (OpenClaw)
                     │  MCP or REST
                     ▼
┌────────────────── Tokey ───────────────────┐
│ authenticated identity                     │
│ tenant + role boundary                     │
│ spending mandate                           │
│ policy, budget, merchant and purpose       │
│ human approval when required               │
│ reservation + execution authorization      │
└─────────────────────┬───────────────────────┘
                      │ authorized execution
                      ▼
              Payment rail (Razorpay)
                      │ signed provider evidence
                      ▼
           Tokey verification + receipt
```

Tokey is rail-neutral. Razorpay is the first verified end-to-end payment rail; OpenClaw is the demonstrated agent runtime. Neither is trusted to define the agent's authority.

## Verified Razorpay proof

The canonical buildathon transaction followed the complete governed path:

```text
spend intent
→ authority evaluation
→ human approval
→ reservation
→ context-bound execution authorization
→ Razorpay Test Mode order
→ payment
→ authenticated provider evidence
→ trusted settlement verification
→ CAPTURED
→ immutable receipt
```

| Evidence | Verified value |
| --- | --- |
| Amount | ₹1,799 INR |
| Razorpay order | `order_TXyMzUr2UugFqz` |
| Razorpay payment | `pay_TXydA9YASOdQQ5` |
| Provider result | `captured` |
| Tokey reservation | `CAPTURED` |
| Settlement evidence | `VERIFIED_CAPTURE` |
| Receipt type | `SPEND_CAPTURED_V2` |
| Receipt ID | `rcpt_9b19f70f334142d687923085cccdcbe9` |

Tokey does not treat a successful browser screen as financial finality. Provider evidence must be authenticated and must match the reserved amount, currency, order, and economic context before capture is recorded.

[Read the Razorpay proof →](docs/RAZORPAY_PROOF.md)

## Product surfaces

The included React console is the real Tokey control-plane interface—not a standalone payment mock.

| Surface | What it shows |
| --- | --- |
| Overview | Governed activity, authority totals, and system state |
| Agents | Provisioned economic actors and their bounded access |
| Authorities | Budgets, scopes, merchants, purposes, rails, limits, and expiry |
| Approvals | Human decisions required before high-risk execution |
| Transactions | The lifecycle from request through verified settlement |
| Receipts | Immutable evidence for authorized financial outcomes |
| Integrations | Razorpay execution and OpenClaw runtime boundaries |
| MCP / API | Public integration contracts for agents and applications |
| Webhooks | Provider evidence intake and verification state |

## OpenClaw and MCP

Tokey exposes an authenticated MCP surface so an agent runtime can inspect authority, request spend, and progress permitted work without acquiring operator powers.

```text
Telegram → TON → OpenClaw → Tokey MCP → Tokey Core
```

Agent credentials cannot create root authority, expand or delegate their own mandate, self-approve, or revoke arbitrary authorities. Operator actions remain separately authorized.

The OpenClaw proof validates the runtime-to-authority chain. It does **not** claim that TON originated the canonical ₹1,799 Razorpay transaction.

[Read the OpenClaw proof →](docs/OPENCLAW_PROOF.md) · [Inspect the MCP contract →](contracts/mcp/tools.json)

## Security properties

- Identity comes from an authenticated Tokey credential—not an agent-supplied ID.
- Tenant isolation and role authorization gate control-plane operations.
- Mandates constrain budgets, merchants, purposes, resource types, rails, transaction size, approval thresholds, and expiry.
- Non-permitted requests fail closed before provider execution.
- Approved capacity is reserved before execution.
- Execution authorizations are bound to the approved economic context.
- Revocation, idempotency, replay protection, and auditable receipts are first-class concerns.
- External settlement is final only after trusted provider evidence is verified.

[Read the security model →](docs/SECURITY_MODEL.md)

## Explore this release

```text
frontend/                 React control-plane console
contracts/api/            Public REST/OpenAPI contract
contracts/mcp/            Public MCP tool contract
integrations/razorpay/    Safe rail-boundary schemas
examples/openclaw/        Credential-free MCP configuration example
docs/                     Architecture, evidence, security, and demo guide
tests/                    Selected public contract checks
```

Start with:

1. [Architecture](docs/ARCHITECTURE.md)
2. [Five-minute demo walkthrough](docs/DEMO.md)
3. [Razorpay Test Mode proof](docs/RAZORPAY_PROOF.md)
4. [OpenClaw / MCP proof](docs/OPENCLAW_PROOF.md)
5. [Public REST contract](contracts/api/openapi.json)

## Run the interface

Requirements: Node.js 18+ and npm.

```bash
cd frontend
npm ci
npm run typecheck
npm run build
npm run dev
```

The production interface consumes the documented Tokey HTTP contract. Live data requires a running Core instance and a provisioned dashboard session; credentials are never shipped in this repository.

Run the selected public checks from the repository root with Python 3.10+:

```bash
python -m unittest tests/test_public_contracts.py
```

## Public release boundary

This repository intentionally publishes the product interface, integration contracts, Razorpay and OpenClaw proof, architecture, security properties, and selected reproducible tests.

The complete Tokey Core v0.1 used for the demo remains proprietary. Authorization-kernel implementation, execution and concurrency controls, signing internals, settlement-verifier internals, private adversarial tests, credentials, and operational topology are not included.

> This repository contains Tokey's public product interface, integration contracts, and verified Razorpay/OpenClaw proof. Selected authorization, execution, and settlement-kernel internals remain proprietary.

## Status

Tokey Core v0.1 is a buildathon-stage product with a verified Razorpay Test Mode settlement path. The evidence here establishes the demonstrated flow; it is not a claim of live-money production certification or general availability.

## License

No open-source license has been granted for this repository. All rights reserved.
