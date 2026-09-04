# Tokey

Financial control plane for autonomous AI agents.

Give agents financial capabilities without giving them unrestricted financial power.

```text
Agent runtime
      ↓
Tokey MCP / API
      ↓
Identity + authority
      ↓
Policy / budget / approval
      ↓
Execution authorization
      ↓
Payment rail
      ↓
Trusted settlement verification
      ↓
Receipt / audit
```

The agent decides what it wants to do. Tokey decides whether it is financially authorized. Razorpay moves the money.

## Buildathon proof

Tokey's first verified payment rail is Razorpay Test Mode. A ₹1,799 INR governed spend reached `CAPTURED` after provider evidence was verified and a Tokey receipt was issued. Test Mode uses simulated funds; no real money moved.

- [Razorpay proof](docs/RAZORPAY_PROOF.md)
- [OpenClaw / MCP proof](docs/OPENCLAW_PROOF.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security model](docs/SECURITY_MODEL.md)
- [Demo walkthrough](docs/DEMO.md)

## What is in this release

- The real React control-plane interface in [`frontend/`](frontend/)
- Public REST and MCP contracts in [`contracts/`](contracts/)
- A safe Razorpay integration schema in [`integrations/razorpay/`](integrations/razorpay/)
- Public proof material, examples, and selected contract tests

## Repository scope

This buildathon repository contains Tokey's public product interface, developer contracts, Razorpay integration proof, OpenClaw/MCP integration material, architecture documentation, and selected reproducible tests.

Tokey's authorization/execution kernel includes proprietary implementation details around live authority evaluation, execution authorization, concurrency control, signing, and trusted settlement verification. Selected kernel internals are intentionally not included in this public repository.

The submitted demo was run against the complete Tokey Core v0.1 implementation.

## Run the frontend

```bash
cd frontend
npm install
npm run typecheck
npm run build
```

The UI calls the documented Tokey HTTP contract. A running Core instance and an authenticated dashboard session are required for live data; this release does not ship the proprietary Core kernel or credentials.

## License

No open-source license has been selected for this repository.
