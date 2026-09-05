# Fail-closed denial proof

Track 01 asks for a failure handled gracefully. Tokey's canonical failure is a policy denial before payment execution—not an artificial crash.

## Governed authority

| Constraint | Value |
| --- | --- |
| Agent | Shopping Agent |
| Total authority | ₹2,000 INR |
| Merchant | FitFuel |
| Allowed purpose | purchase supplements |
| Resource | product |
| Rail | Razorpay |
| Maximum transaction | ₹2,000 |
| Human approval above | ₹1,500 |

## Disallowed request

| Field | Value |
| --- | --- |
| Product | ANC Headphones |
| Amount | ₹7,999 INR |
| Category / purpose | electronics / `purchase:electronics` |
| Core decision | `DENY` |
| Core reasons | transaction limit exceeded plus purpose/scope mismatch |
| Reservation | none |
| Razorpay call count | `0` |
| Razorpay order | not created |
| Checkout after denial | blocked |

```text
agent intent
→ authenticated Shopping Agent
→ active authority loaded
→ amount and purpose evaluated
→ DENY
→ no reservation
→ no execution authorization
→ no Razorpay call
```

Two complementary checks establish this behavior. They were rerun on 5 September 2026: **4 tests passed**.

1. The isolated integration test runs the real Core against a temporary database through authenticated HTTP calls. It verifies purpose/limit denial and absence of a reservation. Its later settlement/replay checks use synthetic signed evidence, not Razorpay network traffic.
2. Three harness tests use a stubbed Core response and a test provider. They verify that a denied request cannot create an order or proceed to checkout. These establish adapter behavior; they are not a live provider execution trace.

Together, the tests assert:

```text
decision == DENY
reservation_id is empty
AMOUNT_EXCEEDS_MAX_TRANSACTION is present
purpose/category scope mismatch is present
razorpay.call_count == 0
razorpay.order_id is empty
subsequent checkout is rejected
```

This is the safety property Tokey is built to provide: a disallowed economic action stops before the irreversible boundary.

## Disclosure

This document summarizes test evidence, not a published production denial record. No persisted denial ID or raw runtime trace is included here. Do not present the combined assertions as one continuous live run in the video.

The tests above remain in the private implementation. Public tests check documentation and contract structure only; they do not independently exercise financial enforcement. The real Razorpay Test Mode capture is separately documented in [RAZORPAY_PROOF.md](RAZORPAY_PROOF.md).
