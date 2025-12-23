from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import stripe
from app.exception.payment_exceptions import PaymentMethodRequired, PaymentNotSuccessful

router = APIRouter(prefix="/payment", tags=["Stripe Payments"])

stripe_api_key = "sk_test_51SgUkj2MZSsaVhafRSEUKGYkZtxy6mVj8SkYW0nUFDBINth7AuR9p1qn5jYMuVwXY5RG7Q0wkfd7nQHVBUf4jSFo00TQ53BhoM"
stripe.api_key = stripe_api_key

class PaymentIn(BaseModel):
    amount: float
    currency: Optional[str] = "usd"
    paymentMethodID: Optional[str] = None
    description: Optional[str] = None

class PaymentOut(BaseModel):
    amount: float
    currency: str
    status: str
    stripe_payment_intent: Optional[str] = None
    error: Optional[str] = None

payments_history: List[PaymentOut] = []

@router.post("/pay", response_model=PaymentOut)
def create_payment(payment: PaymentIn):
    try:
        amount_cents = int(round(payment.amount * 100))

        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment.currency,
            payment_method=payment.paymentMethodID,
            confirm=True if payment.paymentMethodID else False,
            payment_method_types=["card"],
            description=payment.description,
        )

        if intent.status == "requires_payment_method":
            raise PaymentMethodRequired("Payment requires a valid payment method.")

        if intent.status != "succeeded":
            raise PaymentNotSuccessful(f"Payment not successful. Status: {intent.status}")

        # Payment succeeded
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status=intent.status,
            stripe_payment_intent=intent.id,
            error=None
        )
        payments_history.append(out)
        print(JSONResponse(content=out.dict(), status_code=201).body)
        return JSONResponse(content=out.dict(), status_code=201)

    except PaymentMethodRequired as e:
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status="failed",
            stripe_payment_intent=None,
            error=str(e)
        )
        payments_history.append(out)
        return JSONResponse(content=out.dict(), status_code=402)

    except PaymentNotSuccessful as e:
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status="failed",
            stripe_payment_intent=None,
            error=str(e)
        )
        payments_history.append(out)
        return JSONResponse(content=out.dict(), status_code=402)

    except stripe.error.CardError as e:
        # Stripe card errors have a JSON body we can return
        err_body = e.json_body.get("error", {}) if e.json_body else {}
        user_message = err_body.get("message", str(e))
        print("CardError:", user_message)
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status="failed",
            stripe_payment_intent=None,
            error=user_message
        )
        payments_history.append(out)
        print(JSONResponse(content=out.dict(), status_code=402).body)
        return JSONResponse(content=out.dict(), status_code=402)

    except stripe.error.StripeError as e:
        # Other Stripe errors
        user_message = getattr(e, "user_message", str(e))
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status="failed",
            stripe_payment_intent=None,
            error=user_message
        )
        payments_history.append(out)
        return JSONResponse(content=out.dict(), status_code=400)

    except Exception as e:
        out = PaymentOut(
            amount=payment.amount,
            currency=payment.currency,
            status="failed",
            stripe_payment_intent=None,
            error=str(e)
        )
        payments_history.append(out)
        return JSONResponse(content=out.dict(), status_code=500)