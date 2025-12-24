from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from app.paypal.client import client
from typing import Optional


def _extract_approval_link(result) -> Optional[str]:
    links = getattr(result, "links", []) or []
    for l in links:
        if getattr(l, "rel", "") == "approve":
            return getattr(l, "href", None)
    return None


def create_order(amount: float, currency: str = "USD", description: str = ""):
    request = OrdersCreateRequest()
    request.prefer("return=representation")
    request.request_body({
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": currency,
                "value": str(amount)
            },
            "description": description
        }]
    })
    response = client.execute(request)
    result = response.result
    # attach approval link to result for convenience
    approve = _extract_approval_link(result)
    if approve:
        setattr(result, "approval_link", approve)
    return result


def capture_order(order_id: str):
    request = OrdersCaptureRequest(order_id)
    request.prefer("return=representation")
    response = client.execute(request)
    return response.result