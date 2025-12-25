from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.status import StatusEnum


class TicketPayment(Base):
    __tablename__ = "ticket_payment"

    payment_id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, nullable=False)
    method_id = Column(Integer, nullable=False)

    amount = Column(Float, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.PENDING)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())