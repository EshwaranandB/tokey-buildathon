# Tokey submission and recording kit

## Form copy

**Track:** AI Growth & Agentic Commerce

**Title:** Tokey — Financial Control Plane for Autonomous AI Agents

**One sentence:** Tokey gives autonomous AI agents bounded financial authority, gates requested purchases through policy and human approval, and verifies Razorpay settlement before recording a final receipt.

**Problem:** An autonomous agent can choose a product and request payment, but a credential alone cannot express who it acts for, what it may buy, how much it may spend, when a human must approve, or what constitutes verified settlement. Companies need financial control that remains enforceable as models and agent runtimes change.

**Solution:** Tokey authenticates the actor, evaluates its mandate, reserves permitted capacity, and binds execution to approved economic context. Razorpay executes the payment. Tokey verifies provider evidence before recording capture. The console exposes authority, approvals, transactions and receipts to the human operator.

**What we demonstrated:** A ₹1,799 Razorpay Test Mode payment reached verified Core capture and a receipt. Separately, TON/OpenClaw inspected financial authority through MCP. Isolated tests cover out-of-scope denial, blocked provider execution and duplicate settlement handling. These are distinct evidence sources, not a claim that TON performed the canonical payment autonomously.

**Meaningful AI:** The external agent runtime interprets user intent and reasons about requested actions. The demonstrated MCP interaction reads its permitted authority. Financial permission is evaluated deterministically by Core; an LLM cannot grant itself authority or human approval.

**Technical challenge:** An expired execution authorization could strand an otherwise valid reservation. The implemented refresh operation renews expired, unused authorization in place while preserving economic context. A second challenge was defining finality: checkout success must be reconciled with authenticated provider evidence before Core records capture.

**Repository:** https://github.com/EshwaranandB/tokey-buildathon

**Disclosure:** The public repository contains the interface, contracts and documented evidence. Selected authorization, execution and settlement internals remain proprietary. Public checks do not reproduce the private kernel. Tokey is being developed beyond this Buildathon; the demonstrated payment rail is Razorpay Test Mode.

## Five-minute recording: narration and screen direction

Aim for 4:30–4:50 including pauses. Speak naturally; give the evidence time to be read.

### 0:00–0:25 — Start with the outcome

Screen: the captured ₹1,799 transaction alongside its receipt. Label it “Recorded Razorpay Test Mode transaction — simulated funds.”

“This is an AI commerce purchase governed by Tokey. A ₹1,799 request crossed a human approval threshold, received authorization, and completed through Razorpay Test Mode. The important result is not just a successful checkout. It is a verified financial record.”

### 0:25–0:55 — Make the product clear

Screen: one diagram from the architecture guide.

“Tokey is the financial control plane for autonomous AI agents. The agent decides what it wants to do. Tokey decides whether it is financially authorized. Razorpay moves the money. An organization can give an agent useful autonomy while retaining control over its budget, merchant scope, purpose and approval requirements.”

### 0:55–1:30 — Show an external agent

Screen: actual Telegram/OpenClaw authority response. Show the response date and distinguish total authority from available balance.

“TON runs through OpenClaw, outside this dashboard. Here it uses Tokey's MCP interface to inspect its authority. That demonstrates the runtime connection. The ₹1,799 payment is a separate recorded proof. AI can interpret intent and reason about a request; it cannot rewrite this financial mandate.”

### 1:30–2:00 — Show the human boundary

Screen: authenticated authority and historical approval evidence.

“This mandate provides ₹2,000 of authority, permits supplement purchases from FitFuel, and requires human approval above ₹1,500. The ₹1,799 purchase needed approval. Tokey reserved the approved capacity and issued an execution authorization tied to that economic context.”

### 2:00–2:55 — Let the evidence carry the pitch

Screen: Razorpay Test Mode captured payment, then matching Core reservation and receipt. Pause on matching amount and identifiers.

“Here is the Razorpay order and captured payment. Here is the corresponding Tokey record. Tokey verifies the provider evidence against the expected order and reserved context before capture becomes final in Core. This receipt connects the authorized action to its verified outcome. No real money moved in Test Mode.”

### 2:55–3:30 — Demonstrate safe failure

Screen: actual test run output, labelled “Isolated tests — real Core policy; separate stubbed adapter.”

“A ₹7,999 electronics request violates this mandate. Our real-Core integration test rejects it without a reservation. Separate adapter tests confirm that denial produces zero provider calls, no order, and blocked checkout. These are distinct checks of the policy and execution boundaries. Four selected tests passed.”

### 3:30–4:00 — Explain technical depth

Screen: evidence guide and replay result if available from the isolated test recording.

“Authority remains live state. Approval, reservation and execution are separate steps, and settlement requires evidence. In our isolated Core integration test, replaying the same signed test evidence produces a duplicate result without another capture transition. That test is separate from the real Razorpay payment proof.”

### 4:00–4:35 — Close on the product

Screen: console, then public repository.

“Tokey is a product we are building beyond this Buildathon. Razorpay is our demonstrated payment rail, and OpenClaw shows that the runtime can be external. The public repository contains the interface, contracts and evidence; selected kernel internals remain proprietary. Our next milestone is broader customer validation across real agent workflows. Give agents money. Keep control. See everything.”

## Recording requirements

- Capture authenticated evidence, not static badges or documentation presented as a live response.
- Keep credentials, authorization headers, webhook signatures, customer details and unrelated notifications off screen.
- Do not click Execute, Reconcile or repeat checkout for the recording; use the completed transaction.
- Use the actual returned authority balance. Do not relabel the historical ₹2,000 grant as current available funds.
- If no runtime clip or authenticated receipt is available, obtain it before recording that segment; do not animate a fabricated response.
- Keep test evidence labelled. Do not claim that the public tests exercise the private financial engine.

## Completion gate

Written materials are ready. The final submission still requires an actual recorded video, an accessible video URL, and submission through the official form. No video URL or submission confirmation has been produced by preparing this document.
