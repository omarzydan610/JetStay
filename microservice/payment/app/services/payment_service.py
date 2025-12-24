from typing import Optional, List, Union
from sqlalchemy.orm import Session
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
    db.commit()
    db.refresh(db_payment)

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