from types import SimpleNamespace
from fastapi.testclient import TestClient
import app.api.routes as routes_mod
from app.main import app

client = TestClient(app)

# ---------------- Helpers ----------------

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


# ---------------- DB Stubs ----------------

def stub_save(db, amount, status, stripe_intent=None, error=None,
              ticket_id=None, booking_transaction_id=None,
              method_id=None, currency=None):
    return SimpleNamespace(payment_id=999, amount=amount)


def stub_update(db, payment_id, status, stripe_intent=None, error=None):
    return SimpleNamespace(payment_id=payment_id)


# ---------------- Tests ----------------

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


# ---------- Stripe Tickets ----------

def test_stripe_ticket_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr(
        "stripe.PaymentIntent.create",
        lambda **kw: make_pi("succeeded", "pi_ok")
    )

    payload = {
        "amount": 10.0,
        "currency": "USD",
        "paymentMethod": "pm_card",
        "ticketIds": [1, 2]
    }

    r = client.post("/api/payment/pay/ticket", json=payload)
    assert r.status_code == 201
    assert r.json()["stripe_payment_intent"] == "pi_ok"


def test_stripe_ticket_requires_payment(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr(
        "stripe.PaymentIntent.create",
        lambda **kw: make_pi("requires_payment_method", "pi_fail")
    )

    payload = {
        "amount": 10.0,
        "currency": "USD",
        "paymentMethod": "pm_invalid",
        "ticketIds": [1]
    }

    r = client.post("/api/payment/pay/ticket", json=payload)
    assert r.status_code in (400, 402)


# ---------- Stripe Room ----------

def test_stripe_booking_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "update_payment", stub_update)
    monkeypatch.setattr(
        "stripe.PaymentIntent.create",
        lambda **kw: make_pi("succeeded", "pi_booking")
    )

    payload = {
        "amount": 50.0,
        "currency": "USD",
        "paymentMethod": "pm_card",
        "bookingTransactionId": 2
    }

    r = client.post("/api/payment/pay/room", json=payload)
    assert r.status_code == 201
    assert r.json()["stripe_payment_intent"] == "pi_booking"


# ---------- PayPal Tickets ----------

def test_paypal_ticket_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "create_order", lambda a, c: make_order())
    monkeypatch.setattr(routes_mod, "capture_order", lambda oid: make_capture("COMPLETED"))

    payload = {
        "amount": 20.0,
        "currency": "USD",
        "ticketIds": [3, 4],
        "methodId": 2
    }

    r = client.post("/api/payment/paypal/ticket", json=payload)
    assert r.status_code == 201
    assert r.json()["status"] == "succeeded"


def test_paypal_ticket_failed(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "create_order", lambda a, c: make_order())
    monkeypatch.setattr(routes_mod, "capture_order", lambda oid: make_capture("FAILED"))

    payload = {
        "amount": 20.0,
        "currency": "USD",
        "ticketIds": [1],
        "methodId": 2
    }

    r = client.post("/api/payment/paypal/ticket", json=payload)
    assert r.status_code >= 200 and r.status_code < 300


# ---------- PayPal Room ----------

def test_paypal_booking_success(monkeypatch):
    monkeypatch.setattr(routes_mod, "save_payment", stub_save)
    monkeypatch.setattr(routes_mod, "create_order", lambda a, c: make_order())
    monkeypatch.setattr(routes_mod, "capture_order", lambda oid: make_capture("COMPLETED"))

    payload = {
        "amount": 75.0,
        "currency": "USD",
        "bookingTransactionId": 4,
        "methodId": 2
    }

    r = client.post("/api/payment/paypal/room", json=payload)
    assert r.status_code == 201
    assert r.json()["status"] == "succeeded"


# ---------- History ----------

def test_history_empty(monkeypatch):
    monkeypatch.setattr(routes_mod, "payments_history", [])
    r = client.get("/api/payment/history")
    assert r.status_code == 200
    assert r.json() == []


def test_history_multiple(monkeypatch):
    monkeypatch.setattr(
        routes_mod,
        "payments_history",
        [{"payment_id": 1, "status": "succeeded"}, {"payment_id": 2, "status": "failed"}],
    )
    r = client.get("/api/payment/history")
    assert r.status_code == 200
    assert len(r.json()) == 2


# ---------- Validation ----------

def test_missing_payload():
    r = client.post("/api/payment/pay/ticket", json={})
    assert r.status_code == 422


def test_invalid_route():
    r = client.post("/api/payment/pay/invalid", json={})
    assert r.status_code == 404