from typing import Optional, List, Union
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.ticket_payment import TicketPayment, StatusEnum
from app.models.room_payment import RoomPayment

payments_history: List[dict] = []


def save_payment(db: Session, amount: float, status: StatusEnum,
                 stripe_intent: Optional[str] = None, error: Optional[str] = None,
                 ticket_id: Optional[int] = None, booking_transaction_id: Optional[int] = None,
                 method_id: Optional[int] = None, currency: Optional[str] = "USD") -> Union[TicketPayment, RoomPayment]:
    # choose model based on which identifier is provided
    if booking_transaction_id is not None:
        db_payment = RoomPayment(
            amount=amount,
            status=status,
            booking_transaction_id=booking_transaction_id if booking_transaction_id is not None else 0,
            method_id=method_id if method_id is not None else 2,
        )
    else:
        db_payment = TicketPayment(
            amount=amount,
            status=status,
            ticket_id=ticket_id if ticket_id is not None else 0,
            method_id=method_id if method_id is not None else 2,
        )

    db.add(db_payment)
    try:
        db.commit()
        db.refresh(db_payment)
    except SQLAlchemyError as exc:
        db.rollback()
        # record failed attempt in history for debugging
        payments_history.append({
            "payment_id": None,
            "amount": amount,
            "currency": currency,
            "status": "ERROR",
            "stripe_payment_intent": stripe_intent,
            "error": str(exc)
        })
        raise

    # record history entry; include whichever identifier is available
    entry = {
        "payment_id": db_payment.payment_id,
        "amount": amount,
        "currency": currency,
        "status": status.value,
        "stripe_payment_intent": stripe_intent,
        "error": error,
    }
    if booking_transaction_id is not None:
        entry["booking_transaction_id"] = booking_transaction_id
    else:
        entry["ticket_id"] = ticket_id

    payments_history.append(entry)
    return db_payment


def update_payment(db: Session, payment_id: int, status: StatusEnum, stripe_intent: Optional[str] = None, error: Optional[str] = None) -> Optional[Union[TicketPayment, RoomPayment]]:
    # Try TicketPayment
    obj = db.query(TicketPayment).filter(TicketPayment.payment_id == payment_id).first()
    if obj is None:
        obj = db.query(RoomPayment).filter(RoomPayment.payment_id == payment_id).first()
    if obj is None:
        return None
    obj.status = status
    # try to set extra fields if models support them
    try:
        if stripe_intent is not None:
            setattr(obj, "stripe_payment_intent", stripe_intent)
    except Exception:
        pass
    try:
        if error is not None:
            setattr(obj, "error", error)
    except Exception:
        pass

    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)
    except SQLAlchemyError:
        db.rollback()
        raise

    # update history entry if present
    for h in payments_history:
        if h.get("payment_id") == payment_id:
            h["status"] = status.value
            if stripe_intent:
                h["stripe_payment_intent"] = stripe_intent
            if error:
                h["error"] = error
    return obj