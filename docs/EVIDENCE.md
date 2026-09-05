# Judge's evidence guide

Tokey's central claim: financial authority belongs to a deterministic control plane, while AI selects the requested action and Razorpay executes an authorized payment.

## Inspect in this order

| Question | Evidence | What it establishes | Limit |
| --- | --- | --- | --- |
| Did a payment complete? | [Razorpay record](RAZORPAY_PROOF.md) | Recorded ₹1,799 Test Mode capture, provider identifiers and Core receipt | Historical proof; identifiers alone do not authenticate the result for a reader |
| Is there an external agent? | [OpenClaw record](OPENCLAW_PROOF.md) | Reported external runtime inspecting Core authority through MCP | Does not establish that TON initiated the canonical payment |
| Does policy actually deny? | [Denial tests](DENIAL_PROOF.md) | Real Core rejects an out-of-scope and oversized request without reserving funds | Isolated database; no production denial trace published |
| Does the adapter stop? | [Denial tests](DENIAL_PROOF.md) | Stubbed harness checks zero provider calls, empty order and rejected checkout | Separate from the real-Core test |
| Can settlement be replayed? | Isolated Core integration rerun, 5 September 2026 | Repeated synthetic signed evidence returns duplicate without a second transition | Not a production webhook replay or PostgreSQL concurrency proof |
| Can I inspect the product? | [Frontend](../frontend/) and [contracts](../contracts/) | UI implementation and declared integration surfaces | A provisioned Core instance is required for live data |

## Verification performed for this release

On 5 September 2026 the existing private test selection passed: three denial harness tests and one external-customer Core integration test. The integration launches a temporary local Core database and checks agent role restrictions, denial, approval, reservation, execution authorization, synthetic settlement and replay. No real provider call or new payment is made by these checks.

The public contract tests check file content and contract structure. Passing those tests is not proof of authorization correctness or settlement integrity.

## What the recording should add

Show the provider's Test Mode payment record and the corresponding authenticated Core reservation and receipt, with matching identifiers and amount. Show an actual external-runtime authority response. Label historical recordings and isolated tests on screen. Do not substitute hardcoded integration status badges for runtime evidence.

The reader can inspect the public interface and contracts; the proprietary kernel is not independently reproducible from this repository. Any deeper technical review requires access arranged separately.
