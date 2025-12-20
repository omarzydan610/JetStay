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
