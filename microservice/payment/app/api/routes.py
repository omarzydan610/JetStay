from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
import stripe
from sqlalchemy.orm import Session

from app.exception.payment_exceptions import PaymentMethodRequired, PaymentNotSuccessful
from app.api import schemas
from app.api.deps import get_db
from app.services.payment_service import save_payment, payments_history, update_payment
from app.models.status import StatusEnum
from app.paypal.payments import create_order, capture_order
from app.core import config

router = APIRouter(prefix="/payment", tags=["Payments"])

# Configure stripe from central config
stripe.api_key = config.STRIPE_API_KEY


@router.post("/pay/ticket", response_model=schemas.PaymentOut)
def create_ticket_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    # create a pending DB record first
    saved = save_payment(db, payment.amount, StatusEnum.PENDING, ticket_id=payment.ticketId, method_id=payment.methodId if payment.methodId is not None else 2, currency=payment.currency)
    out = schemas.PaymentOut(payment_id=saved.payment_id, amount=payment.amount, currency=payment.currency, status=StatusEnum.PENDING)
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

        # update to completed
        update_payment(db, saved.payment_id, StatusEnum.COMPLETED, stripe_intent=intent.id)
        out.status = intent.status
        out.stripe_payment_intent = intent.id
        return JSONResponse(content=out.dict(), status_code=201)

    except (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError, stripe.error.StripeError, Exception) as e:
        # mark failed
        try:
            update_payment(db, saved.payment_id, StatusEnum.FAILED, error=str(e))
        except Exception:
            pass
        out.error = str(e)
        out.status = StatusEnum.FAILED
        status_code = 402 if isinstance(e, (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError)) else 400
        return JSONResponse(content=out.dict(), status_code=status_code)

@router.post("/pay/room", response_model=schemas.PaymentOut)
def create_room_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    # create a pending DB record first for room payment
    saved = save_payment(db, payment.amount, StatusEnum.PENDING, booking_transaction_id=payment.bookingTransactionId, method_id=payment.methodId if payment.methodId is not None else 2, currency=payment.currency)
    out = schemas.PaymentOut(payment_id=saved.payment_id, amount=payment.amount, currency=payment.currency, status=StatusEnum.PENDING)
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

        # update to completed
        update_payment(db, saved.payment_id, StatusEnum.COMPLETED, stripe_intent=intent.id)
        out.status = intent.status
        out.stripe_payment_intent = intent.id
        return JSONResponse(content=out.dict(), status_code=201)

    except (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError, stripe.error.StripeError, Exception) as e:
        try:
            update_payment(db, saved.payment_id, StatusEnum.FAILED, error=str(e))
        except Exception:
            pass
        out.error = str(e)
        out.status = StatusEnum.FAILED
        status_code = 402 if isinstance(e, (PaymentMethodRequired, PaymentNotSuccessful, stripe.error.CardError)) else 400
        return JSONResponse(content=out.dict(), status_code=status_code)


@router.get("/history")
def payment_history():
    return payments_history


def _process_paypal_capture(db: Session, amount: float, order, ticket_id: Optional[int], booking_transaction_id: Optional[int], method_id: int, currency: str):
    order_id = getattr(order, "id", None)
    try:
        print("Capturing order:", order_id)
        capture = capture_order(order_id)
        print("Capture result:", capture)
    except Exception as e:
        # Save a failed payment record for debugging and return readable error
        try:
            db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=order_id, error=str(e), ticket_id=ticket_id, booking_transaction_id=booking_transaction_id, method_id=method_id, currency=currency)
        except Exception:
            # if saving the failure also fails, continue to return the PayPal error
            db_payment = None
        import traceback
        tb = traceback.format_exc()
        # try to extract extra attributes from exception if available
        extra = {}
        try:
            extra['repr'] = repr(e)
            extra['type'] = type(e).__name__
            if hasattr(e, 'status_code'):
                extra['status_code'] = getattr(e, 'status_code')
            if hasattr(e, 'headers'):
                extra['headers'] = getattr(e, 'headers')
            if hasattr(e, 'body'):
                extra['body'] = getattr(e, 'body')
        except Exception:
            pass

        body = {"error": "paypal_capture_failed", "message": str(e), "traceback": tb, "exception": extra, "payment_id": db_payment.payment_id if db_payment else None}
        print("PayPal capture exception:", body)
        return JSONResponse(content=body, status_code=500)

    saved = None
    try:
        success = getattr(capture, "status", "") == "COMPLETED"
        status_enum = StatusEnum.COMPLETED if success else StatusEnum.FAILED
        currency_code = getattr(capture.purchase_units[0].payments.captures[0].amount, "currency_code", currency)
        saved = save_payment(
            db,
            amount,
            status_enum,
            stripe_intent=order_id,
            error=None if success else "Payment failed",
            ticket_id=ticket_id,
            booking_transaction_id=booking_transaction_id,
            method_id=method_id,
            currency=currency_code
        )
        out = schemas.PaymentOut(
            payment_id=saved.payment_id,
            amount=amount,
            currency=currency_code,
            status=(StatusEnum.COMPLETED if success else StatusEnum.FAILED),
            stripe_payment_intent=order_id,
            error=None if success else "Payment failed"
        )
        return JSONResponse(content=out.dict(), status_code=201 if success else 400)
    except Exception as e:
        # Attempt to record failure if not already saved
        try:
            if saved is None:
                db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=order_id, error=str(e), ticket_id=ticket_id, booking_transaction_id=booking_transaction_id, method_id=method_id, currency=currency)
            else:
                db_payment = saved
        except Exception:
            db_payment = None
        body = {"error": "paypal_processing_failed", "message": str(e), "payment_id": db_payment.payment_id if db_payment else None}
        return JSONResponse(content=body, status_code=500)


@router.post("/paypal/ticket", response_model=schemas.PaymentOut)
def _paypal_ticket(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    amount = payment.amount
    ticketId = payment.ticketId
    method = payment.methodId if payment.methodId is not None else 2
    # Create PayPal order and return approval link. Save a PENDING payment row.
    try:
        order = create_order(amount, payment.currency)
        order_id = getattr(order, "id", None)
        saved = save_payment(db, amount, StatusEnum.COMPLETED, stripe_intent=order_id, ticket_id=ticketId, method_id=method, currency=payment.currency)
        approval_link = getattr(order, "approval_link", None)
        body = {
            "payment_id": saved.payment_id,
            "approval_link": approval_link,
            "order_id": order_id,
            "status": "succeeded"
        }
        return JSONResponse(content=body, status_code=201)
    except Exception as e:
        db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=None, error=str(e), ticket_id=ticketId, method_id=method, currency=payment.currency)
        out = schemas.PaymentOut(payment_id=db_payment.payment_id, amount=amount, currency=payment.currency, status=StatusEnum.FAILED, error=str(e))
        return JSONResponse(content=out.dict(), status_code=500)


@router.post("/paypal/room", response_model=schemas.PaymentOut)
def _paypal_room(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    print(payment)
    amount = payment.amount
    bookingTransactionId = payment.bookingTransactionId
    method = payment.methodId if payment.methodId is not None else 2
    # Create PayPal order and return approval link. Save a PENDING payment row.
    try:
        order = create_order(amount, payment.currency)
        order_id = getattr(order, "id", None)
        saved = save_payment(db, amount, StatusEnum.COMPLETED, stripe_intent=order_id, booking_transaction_id=bookingTransactionId, method_id=method, currency=payment.currency)
        approval_link = getattr(order, "approval_link", None)
        body = {
            "payment_id": saved.payment_id,
            "approval_link": approval_link,
            "order_id": order_id,
            "status": "succeeded"
        }
        return JSONResponse(content=body, status_code=201)
    except Exception as e:
        db_payment = save_payment(db, amount, StatusEnum.FAILED, stripe_intent=None, error=str(e), booking_transaction_id=bookingTransactionId, method_id=method, currency=payment.currency)
        out = schemas.PaymentOut(payment_id=db_payment.payment_id, amount=amount, currency=payment.currency, status=StatusEnum.FAILED, error=str(e))
        return JSONResponse(content=out.dict(), status_code=500)