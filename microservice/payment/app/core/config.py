from os import environ

# Configuration values (can be overridden via environment variables)
STRIPE_API_KEY = environ.get(
    "STRIPE_API_KEY",
    "sk_test_51SgUkj2MZSsaVhafRSEUKGYkZtxy6mVj8SkYW0nUFDBINth7AuR9p1qn5jYMuVwXY5RG7Q0wkfd7nQHVBUf4jSFo00TQ53BhoM",
)

PAYPAL_CLIENT_ID = environ.get(
    "PAYPAL_CLIENT_ID",
    "Ab0xIQ2Fl3Ij0qs4I_eRiGsBY88ca1ddrmTg9WbmejrKZpR2mast8KVeigv0sjJOlPpH4Xw3_9Ly6GXw",
)
PAYPAL_CLIENT_SECRET = environ.get(
    "PAYPAL_CLIENT_SECRET",
    "Ab0xIQ2Fl3Ij0qs4I_eRiGsBY88ca1ddrmTg9WbmejrKZpR2mast8KVeigv0sjJOlPpH4Xw3_9Ly6GXw",
)

DATABASE_URL = environ.get(
    "DATABASE_URL",
    "mysql+pymysql://Hema:2004@localhost:3306/JetStay",
)
