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

The frozen end-to-end demonstration asserted all of the following:

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

This is a sanitized record of the demonstrated Core-plus-Razorpay harness behavior. The public repository exposes the result and contract-level assertions while keeping proprietary authorization-kernel and provider-adapter implementations private.
