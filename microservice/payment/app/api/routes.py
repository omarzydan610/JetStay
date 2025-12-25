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

stripe.api_key = config.STRIPE_API_KEY


# -------------------- STRIPE TICKET PAYMENT --------------------
@router.post("/pay/ticket", response_model=schemas.PaymentOut)
def create_ticket_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    if not payment.ticketIds:
        return JSONResponse(
            content={"error": "ticketIds list is required"},
            status_code=400
        )

    saved_payments = []
    try:
        for ticket_id in payment.ticketIds:
            saved = save_payment(
                db,
                payment.amount,
                StatusEnum.PENDING,
                ticket_id=ticket_id,
                method_id=payment.methodId or 2,
                currency=payment.currency
            )
            saved_payments.append(saved)

        amount_cents = int(round(payment.amount * 100)) / len(payment.ticketIds)
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
            raise PaymentNotSuccessful(f"Payment failed: {intent.status}")

        for p in saved_payments:
            update_payment(db, p.payment_id, StatusEnum.COMPLETED, stripe_intent=intent.id)

        return JSONResponse(
            content={
                "status": "succeeded",
                "stripe_payment_intent": intent.id,
                "ticketIds": payment.ticketIds
            },
            status_code=201
        )

    except Exception as e:
        for p in saved_payments:
            update_payment(db, p.payment_id, StatusEnum.FAILED, error=str(e))
        return JSONResponse(
            content={"status": "failed", "error": str(e)},
            status_code=402
        )


# -------------------- STRIPE ROOM PAYMENT --------------------
@router.post("/pay/room", response_model=schemas.PaymentOut)
def create_room_payment(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    saved = save_payment(
        db,
        payment.amount,
        StatusEnum.PENDING,
        booking_transaction_id=payment.bookingTransactionId,
        method_id=payment.methodId or 2,
        currency=payment.currency
    )

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(round(payment.amount * 100)),
            currency=payment.currency,
            payment_method=payment.paymentMethod,
            confirm=True,
            payment_method_types=["card"],
            description=payment.description,
        )

        if intent.status != "succeeded":
            raise PaymentNotSuccessful(intent.status)

        update_payment(db, saved.payment_id, StatusEnum.COMPLETED, stripe_intent=intent.id)
        return JSONResponse(
            content={"status": "succeeded", "stripe_payment_intent": intent.id},
            status_code=201
        )

    except Exception as e:
        update_payment(db, saved.payment_id, StatusEnum.FAILED, error=str(e))
        return JSONResponse(content={"error": str(e)}, status_code=400)


# -------------------- PAYPAL TICKET PAYMENT --------------------
@router.post("/paypal/ticket", response_model=schemas.PaymentOut)
def paypal_ticket(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    if not payment.ticketIds:
        return JSONResponse(
            content={"error": "ticketIds list is required"},
            status_code=400
        )

    try:
        order = create_order(payment.amount, payment.currency)
        order_id = getattr(order, "id", None)

        payments = []
        for ticket_id in payment.ticketIds:
            saved = save_payment(
                db,
                payment.amount / len(payment.ticketIds),
                StatusEnum.COMPLETED,
                stripe_intent=order_id,
                ticket_id=ticket_id,
                method_id=payment.methodId or 2,
                currency=payment.currency
            )
            payments.append(saved)

        return JSONResponse(
            content={
                "status": "succeeded",
                "order_id": order_id,
                "approval_link": getattr(order, "approval_link", None),
                "ticketIds": payment.ticketIds
            },
            status_code=201
        )

    except Exception as e:
        for ticket_id in payment.ticketIds:
            save_payment(
                db,
                payment.amount,
                StatusEnum.FAILED,
                error=str(e),
                ticket_id=ticket_id,
                method_id=payment.methodId or 2,
                currency=payment.currency
            )
        return JSONResponse(content={"error": str(e)}, status_code=500)


# -------------------- PAYPAL ROOM PAYMENT --------------------
@router.post("/paypal/room", response_model=schemas.PaymentOut)
def paypal_room(payment: schemas.PaymentIn, db: Session = Depends(get_db)):
    try:
        order = create_order(payment.amount, payment.currency)
        order_id = getattr(order, "id", None)

        saved = save_payment(
            db,
            payment.amount,
            StatusEnum.COMPLETED,
            stripe_intent=order_id,
            booking_transaction_id=payment.bookingTransactionId,
            method_id=payment.methodId or 2,
            currency=payment.currency
        )

        return JSONResponse(
            content={
                "status": "succeeded",
                "order_id": order_id,
                "approval_link": getattr(order, "approval_link", None)
            },
            status_code=201
        )

    except Exception as e:
        save_payment(
            db,
            payment.amount,
            StatusEnum.FAILED,
            error=str(e),
            booking_transaction_id=payment.bookingTransactionId,
            method_id=payment.methodId or 2,
            currency=payment.currency
        )
        return JSONResponse(content={"error": str(e)}, status_code=500)


# -------------------- HISTORY --------------------
@router.get("/history")
def payment_history():
    return payments_history