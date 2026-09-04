from __future__ import annotations

from pydantic import BaseModel, Field


class QuoteIn(BaseModel):
    product_id: str
    quantity: int = Field(default=1, ge=1, le=10)


class PurchaseIntentIn(BaseModel):
    """The ONLY thing a client (agent/UI) may express is intent.

    Amount, currency, product price and merchant come exclusively from the
    server-side catalog + Tokey-approved context.
    """

    product_id: str
    quantity: int = Field(default=1, ge=1, le=10)
    goal_text: str = Field(default="", max_length=400)


class ExistingSpendImportIn(BaseModel):
    """Reference only; Core remains the source of economic truth."""

    spend_request_id: str = Field(min_length=1, max_length=80)


class ApprovalIn(BaseModel):
    approved: bool
    decided_by: str = Field(default="human-operator", max_length=80)


class CheckoutCallbackIn(BaseModel):
    """Browser checkout callback — NEVER trusted as settlement proof."""

    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class CheckoutOut(BaseModel):
    key_id_public: str
    order_id: str
    amount_paise: int
    currency: str
    merchant_id: str
    product_id: str
    product_name: str
    provider_mode: str
    tokey: dict


class TimelineEvent(BaseModel):
    step: str
    detail: str = ""
    state: str = "ok"  # ok | warn | error
