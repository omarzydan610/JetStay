from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment, LiveEnvironment
from app.core import config

# Choose environment based on config.PAYPAL_MODE ('sandbox' or 'live')
mode = getattr(config, "PAYPAL_MODE", "sandbox").lower()
if mode == "live":
	environment = LiveEnvironment(client_id=config.PAYPAL_CLIENT_ID, client_secret=config.PAYPAL_CLIENT_SECRET)
else:
	environment = SandboxEnvironment(client_id=config.PAYPAL_CLIENT_ID, client_secret=config.PAYPAL_CLIENT_SECRET)

client = PayPalHttpClient(environment)
