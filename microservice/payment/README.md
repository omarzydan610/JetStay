# Payment microservice (FastAPI)

Minimal FastAPI scaffold for the `payment` microservice.

Quick start

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Run the app:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Health check: GET `http://localhost:8000/health`

4. API base: `http://localhost:8000/api` (example: `/api/payments`)
 
Stripe test payments

- Set your Stripe test secret key in the environment before calling the Stripe endpoint:

```bash
export STRIPE_API_KEY="sk_test_..."
```

- Example test payment using server-side immediate confirmation (use `pm_card_visa` as a test payment method):

```bash
curl -X POST "http://localhost:8000/api/payment/pay/ticket" \
	-H "Content-Type: application/json" \
	-d '{"amount": 10.00, "currency": "usd", "paymentMethod": "pm_card_visa"}'
```

- The endpoint `POST /api/payment/pay/ticket` will create and confirm a PaymentIntent in Stripe test mode.

PayPal sandbox (free testing)

- Set your PayPal sandbox credentials before calling PayPal endpoints:

```bash
export PAYPAL_CLIENT_ID="...sandbox-client-id..."
export PAYPAL_CLIENT_SECRET="...sandbox-secret..."
```

- Create an order (server creates an order and returns `approve` link):

```bash
curl -X POST "http://localhost:8000/api/payment/pay/paypal/create" \
	-H "Content-Type: application/json" \
	-d '{"amount": 5.00, "currency": "USD"}'
```

- Approve the order: open the `approve` link returned by the previous call in a browser (sandbox flow), or use client-side PayPal checkout.

- Capture the approved order on the server (replace `{order_id}` with the order id returned earlier):

```bash
curl -X POST "http://localhost:8000/api/payment/pay/paypal/capture" \
	-H "Content-Type: application/json" \
	-d '{"order_id":"{order_id}"}'
```

Both Stripe test mode and PayPal Sandbox are free testing environments and will not charge real cards.

