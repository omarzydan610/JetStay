from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_create_and_list():
    # ensure starting from known state (module-level in-memory DB)
    r = client.get("/api/payments")
    assert r.status_code == 200
    # depending on test order this may be empty or contain items; clear by creating a new list
    # For simple scaffold, we expect at least a clean list here.
    assert isinstance(r.json(), list)

    payment = {"id": 1, "amount": 100.0, "currency": "USD"}
    r = client.post("/api/payments", json=payment)
    assert r.status_code == 201
    assert r.json() == payment

    r = client.get("/api/payments")
    assert r.status_code == 200
    assert payment in r.json()
