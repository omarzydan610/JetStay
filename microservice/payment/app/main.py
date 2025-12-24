from fastapi import FastAPI
from .api.routes import router as api_router
from app.database.database import Base, engine
from app.models.ticket_payment import TicketPayment

app = FastAPI(title="payment-service", version="0.1.0")

app.include_router(api_router, prefix="/api")


@app.get("/health")
def health():
	return {"status": "ok"}
