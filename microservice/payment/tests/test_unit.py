from types import SimpleNamespace
from fastapi.testclient import TestClient
import app.api.routes as routes_mod
from app.main import app

client = TestClient(app)


# Helpers to make fake objects
def make_pi(status="succeeded", id_="pi_123"):
    return SimpleNamespace(status=status, id=id_)


def make_capture(status="COMPLETED", currency_code="USD"):
    cap = SimpleNamespace(status=status)
    amt = SimpleNamespace(currency_code=currency_code)
    capture_item = SimpleNamespace(amount=amt)
    payments = SimpleNamespace(captures=[capture_item])
    pu = SimpleNamespace(payments=payments)
    cap.purchase_units = [pu]
    return cap


def make_order(order_id="ORDER123", approval_link="https://pay.approve"):
    o = SimpleNamespace()
    o.id = order_id
    o.approval_link = approval_link
    return o


# Stubs for DB operations
def stub_save(db, amount, status, stripe_intent=None, error=None, ticket_id=None, booking_transaction_id=None, method_id=None, currency=None):
    return SimpleNamespace(payment_id=999, amount=amount)


def stub_update(db, payment_id, status, stripe_intent=None, error=None):
    return SimpleNamespace(payment_id=payment_id, amount=123.45)


# ---- Tests ----

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_stripe_ticket_success(monkeypatch):
    # avoid DB writes
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    # mock stripe intent creation
    monkeypatch.setattr("stripe.PaymentIntent.create", lambda **kw: make_pi(status="succeeded", id_="pi_ok"))

    payload = {"amount": 10.0, "currency": "USD", "paymentMethod": "pm_card", "ticketId": 1}
    r = client.post("/api/payment/pay/ticket", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data.get("payment_id") is not None
    assert data.get("stripe_payment_intent") == "pi_ok"


def test_stripe_ticket_requires_payment(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr("stripe.PaymentIntent.create", lambda **kw: make_pi(status="requires_payment_method", id_="pi_fail"))
    payload = {"amount": 10.0, "currency": "USD", "paymentMethod": "pm_invalid", "ticketId": 1}
    r = client.post("/api/payment/pay/ticket", json=payload)
    assert r.status_code in (400, 402)

# ---- Additional Tests ----

def test_stripe_booking_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr("stripe.PaymentIntent.create", lambda **kw: make_pi(status="succeeded", id_="pi_booking"))

    payload = {"amount": 50.0, "currency": "USD", "paymentMethod": "pm_card", "bookingTransactionId": 2}
    r = client.post("/api/payment/pay/room", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data.get("payment_id") is not None
    assert data.get("stripe_payment_intent") == "pi_booking"


def test_stripe_booking_requires_payment(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr("stripe.PaymentIntent.create", lambda **kw: make_pi(status="requires_payment_method", id_="pi_fail_booking"))

    payload = {"amount": 50.0, "currency": "USD", "paymentMethod": "pm_invalid", "bookingTransactionId": 2}
    r = client.post("/api/payment/pay/room", json=payload)
    assert r.status_code in (400, 402)


def test_paypal_ticket_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr("paypalrestsdk.Order.capture", lambda order_id: make_capture(status="COMPLETED"))

    payload = {"amount": 20.0, "currency": "USD", "orderId": "ORDER1", "ticketId": 3, "methodId": 2}
    r = client.post("/api/payment/paypal/ticket", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data.get("payment_id") is not None
    assert data.get("status") == "succeeded"


def test_paypal_booking_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr("paypalrestsdk.Order.capture", lambda order_id: make_capture(status="COMPLETED"))

    payload = {"amount": 75.0, "currency": "USD", "orderId": "ORDER2", "bookingTransactionId": 4, "methodId": 2}
    r = client.post("/api/payment/paypal/room", json=payload)
    assert r.status_code == 201
    data = r.json()
    assert data.get("payment_id") is not None
    assert data.get("status") == "succeeded"


def test_paypal_ticket_failed(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr("paypalrestsdk.Order.capture", lambda order_id: make_capture(status="FAILED"))

    payload = {"amount": 20.0, "currency": "USD", "orderId": "ORDER_FAIL", "ticketId": "lol", "methodId": 2}
    r = client.post("/api/payment/paypal/ticket", json=payload)
    assert r.status_code >= 400 or r.status_code <= 500
    data = r.json()


def test_invalid_route(monkeypatch):
    payload = {"amount": 10.0, "currency": "USD"}
    r = client.post("/api/payment/pay/invalid", json=payload)
    assert r.status_code == 404


def test_missing_payload(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    r = client.post("/api/payment/pay/ticket", json={})
    assert r.status_code == 422  # FastAPI validation error


def test_history_empty(monkeypatch):
    monkeypatch.setattr(routes_mod, "payments_history", [])
    r = client.get("/api/payment/history")
    assert r.status_code == 200
    assert r.json() == []

def test_history_multiple(monkeypatch):
    monkeypatch.setattr(routes_mod, "payments_history", [
        {"payment_id": 1, "status": "succeeded"},
        {"payment_id": 2, "status": "failed"},
    ])
    r = client.get("/api/payment/history")
    assert r.status_code == 200
    data = r.json()
    assert len(data) == 2
    assert data[0]["status"] == "succeeded"
    assert data[1]["status"] == "failed"

def test_history(monkeypatch):
    monkeypatch.setattr(routes_mod, "payments_history", [{"payment_id": 1, "status": "succeeded"}])
    r = client.get("/api/payment/history")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
