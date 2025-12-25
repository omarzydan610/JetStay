from sqlalchemy import Column, Integer, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.database.database import Base
from app.models.ticket_payment import StatusEnum


class RoomPayment(Base):
    __tablename__ = "room_payment"

    payment_id = Column(Integer, primary_key=True, index=True)
    booking_transaction_id = Column(Integer, nullable=False)
    method_id = Column(Integer, nullable=False)

    amount = Column(Float, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.PENDING)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
