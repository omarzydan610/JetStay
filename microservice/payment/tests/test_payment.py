from fastapi.testclient import TestClient
from app.main import app  # your FastAPI app

client = TestClient(app)

# ----------------------------
# Sample payments for testing
# ----------------------------
valid_payment = {
    "amount": 500.0,
    "currency": "usd",
    "paymentMethod": "pm_card_visa",
    "description": "Ticket payment test"
}

invalid_payment = {
    "amount": 500.0,
    "currency": "usd",
    "paymentMethod": "pm_invalid",
    "description": "Ticket payment test"
}

no_payment_method = {
    "amount": 500.0,
    "currency": "usd",
    "description": "Ticket payment test"
}

# ----------------------------
# Tests
# ----------------------------

def test_create_successful_payment():
    r = client.post("api/payment/pay", json=valid_payment)
    assert r.status_code == 201
    data = r.json()
    assert data["status"] == "succeeded"
    assert data["error"] is None
    assert "stripe_payment_intent" in data

def test_create_payment_invalid_method():
    r = client.post("api/payment/pay", json=invalid_payment)
    print(r.json())
    assert r.status_code == 400
    data = r.json()
    assert data["status"] == "failed"
    assert "Payment requires a valid payment method" in data["error"] or "No such PaymentMethod" in data["error"]

def test_create_payment_no_method():
    r = client.post("api/payment/pay", json=no_payment_method)
    assert r.status_code == 402
    data = r.json()
    assert data["status"] == "failed"
    assert "Payment requires a valid payment method" in data["error"]

def test_payment_history_includes_payments():
    # Make a successful payment
    client.post("api/payment/pay", json=valid_payment)

    r = client.get("api/payment/history")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(p["status"] == "succeeded" for p in data)