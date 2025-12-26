# Define custom exceptions
class PaymentMethodRequired(Exception):
    """Raised when a payment requires a valid payment method."""
    pass

class PaymentNotSuccessful(Exception):
    """Raised when a payment did not succeed."""
    pass