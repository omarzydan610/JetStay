from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


class Payment(BaseModel):
    id: int
    amount: float
    currency: str


_fake_db: List[Payment] = [Payment(id=1, amount=100.0, currency="USD")]


@router.get("/payments", response_model=List[Payment])
async def list_payments():
    return _fake_db


@router.post("/payments", response_model=Payment, status_code=201)
async def create_payment(payment: Payment):
    # naive in-memory append for scaffold/demo purposes
    _fake_db.append(payment)
    return payment
