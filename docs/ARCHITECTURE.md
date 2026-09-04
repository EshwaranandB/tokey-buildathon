# Tokey architecture

Tokey sits between an autonomous agent and an execution rail. It is rail-neutral: a runtime or agent uses Tokey's API or MCP surface, while a connector performs an authorized action on a payment rail.

```text
Human / organization
        ↓
      Tokey
        ↓
Agent identity → authority → policy → budget → approval
        ↓
Agent runtime (OpenClaw, custom MCP, API)
        ↓
Economic request
        ↓
Tokey authorization boundary
        ↓
Payment rail (Razorpay today, x402 alpha, future rails)
        ↓
Provider evidence
        ↓
Tokey verified finality
        ↓
Receipt / audit
```

## Control-plane responsibilities

Tokey binds an economic request to an authenticated actor and a bounded authority. It determines whether that request is permitted, denied, or needs human approval. Allowed actions reserve authority before execution and use a context-bound execution authorization. External settlement is not treated as final until trusted provider evidence is verified.

## Integration boundary

Razorpay executes one rail-specific payment flow. OpenClaw is one agent runtime. Neither replaces Tokey's authority, approval, receipt, or audit responsibilities. The public frontend displays this boundary in Integrations, MCP, API, Webhooks, Authorities, Transactions, and Receipts surfaces.
