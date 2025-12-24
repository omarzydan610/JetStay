from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
import stripe
from sqlalchemy.orm import Session

from app.exception.payment_exceptions import PaymentMethodRequired, PaymentNotSuccessful
from app.api import schemas
from app.api.deps import get_db
from app.services.payment_service import save_payment, payments_history
from app.models.ticket_payment import StatusEnum
from app.paypal.payments import create_order, capture_order
from app.core import config

router = APIRouter(prefix="/payment", tags=["Payments"])

# Configure stripe from central config
stripe.api_key = config.STRIPE_API_KEY


@router.post("/pay/ticket", response_model=schemas.PaymentOut)
def create_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    out = schemas.PaymentOut(payment_id=None, amount=payment.amount, currency=payment.currency, status="failed")
    try:
        amount_cents = int(round(payment.amount * 100))
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment.currency,
            payment_method=payment.paymentMethod,
            confirm=True if payment.paymentMethod else False,
            payment_method_types=["card"],
            description=payment.description,
        )

        if intent.status == "requires_payment_method":
            raise PaymentMethodRequired("Payment requires a valid payment method.")
        if intent.status != "succeeded":
            raise PaymentNotSuccessful(f"Payment not successful. Status: {intent.status}")

        out.status = intent.status
        out.stripe_payment_intent = intent.id
        db_payment = save_payment(
            db,
            amount=payment.amount,
            status=StatusEnum.COMPLETED,
            stripe_intent=intent.id,
            ticket_id=payment.ticketId,
            method_id=payment.methodId,
            currency=payment.currency,
        )
        out.payment_id = db_payment.payment_id
        return JSONResponse(content=out.dict(), status_code=201)

    except (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError, stripe.error.StripeError, Exception) as e:
        db_payment = save_payment(
            db,
            amount=payment.amount,
            status=StatusEnum.FAILED,
            stripe_intent=None,
            error=str(e),
            ticket_id=payment.ticketId,
            method_id=payment.methodId,
            currency=payment.currency,
        )
        out.payment_id = db_payment.payment_id
        out.error = str(e)
        # normalize response status
        out.status = "failed"
        status_code = 402 if isinstance(e, (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError)) else 400
        return JSONResponse(content=out.dict(), status_code=status_code)

@router.post("/pay/room", response_model=schemas.PaymentOut)
def create_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    out = schemas.PaymentOut(payment_id=None, amount=payment.amount, currency=payment.currency, status="failed")
    try:
        amount_cents = int(round(payment.amount * 100))
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment.currency,
            payment_method=payment.paymentMethod,
            confirm=True if payment.paymentMethod else False,
            payment_method_types=["card"],
            description=payment.description,
        )

        if intent.status == "requires_payment_method":
            raise PaymentMethodRequired("Payment requires a valid payment method.")
        if intent.status != "succeeded":
            raise PaymentNotSuccessful(f"Payment not successful. Status: {intent.status}")

        out.status = intent.status
        out.stripe_payment_intent = intent.id
        db_payment = save_payment(
            db,
            amount=payment.amount,
            status=StatusEnum.COMPLETED,
            stripe_intent=intent.id,
            booking_transaction_id=payment.bookingTransactionId,
            method_id=payment.methodId,
            currency=payment.currency,
        )
        out.payment_id = db_payment.payment_id
        return JSONResponse(content=out.dict(), status_code=201)

    except (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError, stripe.error.StripeError, Exception) as e:
        db_payment = save_payment(
            db,
            amount=payment.amount,
            status=StatusEnum.FAILED,
            stripe_intent=None,
            error=str(e),
            booking_transaction_id=payment.bookingTransactionId,
            method_id=payment.methodId,
            currency=payment.currency,
        )
        out.payment_id = db_payment.payment_id
        out.error = str(e)
        # normalize response status
        out.status = "failed"
        status_code = 402 if isinstance(e, (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError)) else 400
        return JSONResponse(content=out.dict(), status_code=status_code)


@router.post("/paypal", response_model=schemas.PaymentOut)
def paypal_payment(amount: float, ticketId: Optional[int] = None, methodId: Optional[int] = None,
                   currency: str = "USD", db: Session = Depends(get_db)):
    # route based on presence of ticketId / bookingTransactionId
    # default methodId to 2 (PayPal) if not provided
    method = methodId if methodId is not None else 2
    # If ticketId provided treat as ticket payment
    if ticketId is not None:
        return _paypal_ticket(amount, ticketId, method, currency, db)
    # otherwise treat as ticket payment without ticket id
    return _paypal_ticket(amount, ticketId, method, currency, db)


@router.get("/history")
def payment_history():
    return payments_history


def _process_paypal_capture(db: Session, amount: float, order, ticket_id: Optional[int], booking_transaction_id: Optional[int], method_id: int, currency: str):
    order_id = getattr(order, "id", None)
    capture = capture_order(order_id)
    success = getattr(capture, "status", "") == "COMPLETED"
    status_enum = StatusEnum.COMPLETED if success else StatusEnum.FAILED
    saved = save_payment(
        db,
        amount,
        status_enum,
        stripe_intent=order_id,
        error=None if success else "Payment failed",
        ticket_id=ticket_id,
        booking_transaction_id=booking_transaction_id,
        method_id=method_id,
        currency=getattr(capture.purchase_units[0].payments.captures[0].amount, "currency_code", currency)
    )
    out = schemas.PaymentOut(
        payment_id=saved.payment_id,
        amount=amount,
        currency=getattr(capture.purchase_units[0].payments.captures[0].amount, "currency_code", currency),
        status=("succeeded" if success else "failed"),
        stripe_payment_intent=order_id,
        error=None if success else "Payment failed"
    )
    return JSONResponse(content=out.dict(), status_code=201 if success else 400)


@router.post("/paypal/ticket", response_model=schemas.PaymentOut)
def _paypal_ticket(amount: float, ticketId: Optional[int] = None, methodId: Optional[int] = None,
                   currency: str = "USD", db: Session = Depends(get_db)):
    method = methodId if methodId is not None else 2
    out = schemas.PaymentOut(payment_id=None, amount=amount, currency=currency, status="failed")
    try:
        order = create_order(amount, currency)
        # attempt immediate capture
        return _process_paypal_capture(db, amount, order, ticket_id=ticketId, booking_transaction_id=None, method_id=method, currency=currency)
    except Exception as e:
        db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=None, error=str(e), ticket_id=ticketId, method_id=method, currency=currency)
        out.payment_id = db_payment.payment_id
        out.error = str(e)
        out.status = "failed"
        return JSONResponse(content=out.dict(), status_code=500)


@router.post("/paypal/room", response_model=schemas.PaymentOut)
def _paypal_room(amount: float, bookingTransactionId: Optional[int] = None, methodId: Optional[int] = None,
                 currency: str = "USD", db: Session = Depends(get_db)):
    method = methodId if methodId is not None else 2
    out = schemas.PaymentOut(payment_id=None, amount=amount, currency=currency, status="failed")
    try:
        order = create_order(amount, currency)
        return _process_paypal_capture(db, amount, order, ticket_id=None, booking_transaction_id=bookingTransactionId, method_id=method, currency=currency)
    except Exception as e:
        db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=None, error=str(e), booking_transaction_id=bookingTransactionId, method_id=method, currency=currency)
        out.payment_id = db_payment.payment_id
        out.error = str(e)
        out.status = "failed"
        return JSONResponse(content=out.dict(), status_code=500)