# Razorpay Test Mode proof

Razorpay is Tokey's first end-to-end verified payment rail.

```text
Tokey authority
→ human approval
→ reservation
→ execution authorization
→ Razorpay Test Mode order
→ payment
→ signed provider evidence
→ Tokey trusted verification
→ CAPTURED
→ immutable receipt
```

## Canonical verified record

| Field | Value |
| --- | --- |
| Amount | ₹1,799 INR |
| Razorpay order | `order_TXyMzUr2UugFqz` |
| Razorpay payment | `pay_TXydA9YASOdQQ5` |
| Provider result | captured |
| Tokey state | CAPTURED |
| Evidence | VERIFIED_CAPTURE |
| Receipt | `rcpt_9b19f70f334142d687923085cccdcbe9` |

This was Razorpay **Test Mode** with simulated funds. No real money moved.

Tokey does not treat browser checkout success as financial finality. A provider event must be authenticated and matched to the expected economic context before Tokey records capture.

The public [`integrations/razorpay/schemas.py`](../integrations/razorpay/schemas.py) file shows safe request/response shapes at the harness boundary. It intentionally excludes secrets and settlement-verifier internals.
