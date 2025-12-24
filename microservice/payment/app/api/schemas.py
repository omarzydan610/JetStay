from pydantic import BaseModel
from typing import Optional

class PaymentIn(BaseModel):
    amount: float
    currency: Optional[str] = "USD"
    paymentMethod: Optional[str] = None
    description: Optional[str] = None
    ticketId: Optional[int] = None
    methodId: Optional[int] = None
    bookingTransactionId: Optional[int] = None


class PaymentOut(BaseModel):
    payment_id: Optional[int]
    amount: float
    currency: str
    status: str
    stripe_payment_intent: Optional[str] = None
    error: Optional[str] = None
