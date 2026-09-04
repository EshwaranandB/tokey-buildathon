# Demo walkthrough

This is a proof film, not a dashboard tour. Keep the finished video under five minutes.

## 0:00–0:40 — Problem and definition

Open on Tokey Overview.

> AI agents can search, reason, and take actions. The hard problem is not whether an AI can make a payment; it is whether that action should be financially authorized right now.

> Tokey is the financial control plane for autonomous AI agents. The agent decides what it wants to do. Tokey decides whether it is financially authorized. Razorpay moves the money.

## 0:40–1:10 — External agent runtime

Briefly show the real chain:

```text
Telegram → TON → OpenClaw → Tokey MCP → Core
```

Show the Shopping Agent reading its ₹2,000 authority, FitFuel merchant scope, supplement purpose, Razorpay rail, and approval threshold. Leave OpenClaw after the authority response.

## 1:10–1:45 — Bounded authority

Open **Agents → Shopping Agent** and its authority. Show:

- ₹2,000 total authority
- FitFuel only
- purchase supplements
- product resource
- Razorpay rail
- approval required above ₹1,500

State that the model cannot rewrite this mandate.

## 1:45–2:10 — Human gate

Show the historical ₹1,799 approval. The request crossed its ₹1,500 threshold, so execution stopped until a human approved it.

## 2:10–3:05 — Verified payment

Open the canonical transaction and follow the evidence:

```text
spend request
→ ₹1,799 reservation
→ execution authorization
→ Razorpay order_TXyMzUr2UugFqz
→ Razorpay pay_TXydA9YASOdQQ5
→ VERIFIED_CAPTURE
→ Tokey CAPTURED
→ receipt rcpt_9b19f70f334142d687923085cccdcbe9
```

Emphasize that Tokey does not trust a checkout-success screen. It verifies provider evidence against the reserved economic context before state becomes final.

## 3:05–3:30 — Graceful failure

Show the persisted denied activity:

```text
₹7,999 headphones · electronics
→ DENY
→ no reservation
→ Razorpay calls: 0
→ no order created
```

The failure happens before the payment rail. See [DENIAL_PROOF.md](DENIAL_PROOF.md).

## 3:30–4:10 — Architecture and AI boundary

Use one diagram:

```text
Agent runtimes
OpenClaw / custom agents
        ↓
      TOKEY
identity · authority · policy
budget · approvals · finality
        ↓
Payment rails
Razorpay · future rails
```

Explain: AI handles ambiguous intent, search, reasoning, and selection. Deterministic Tokey controls financial authority.

## 4:10–4:45 — Close

> Razorpay is building payment rails for the agentic era. Tokey makes those rails safely consumable by autonomous software.

> Today we verified it with Razorpay Test Mode. Tomorrow the same authority can govern different agents and different rails.

End on:

> **Give agents money. Keep control. See everything.**

The buildathon repository contains the public product, contracts, and reproducible integration proof. Selected financial-kernel internals remain proprietary.
