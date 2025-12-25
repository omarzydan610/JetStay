import CheckoutForm from "../../components/Payment/checkoutForm.jsx";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const stripePromise = loadStripe(
  "pk_test_51SgUkj2MZSsaVhaf1ENZ4AtX5clx7JEzXOEOCfd4qpS20MIVZ2vqZwFJ43QHVfGvsREfsJfZ19KBxPq78Ja405Qu00X5PSI8JO"
);

export default function StripePaymentPage() {
  const location = useLocation();

  const { ticket } = location.state || {};
  const { bookingTransaction } = location.state || {};
  console.log("Payment Page - Ticket:", ticket);
  console.log("Payment Page - Booking Transaction:", bookingTransaction);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Stripe Elements + PayPal provider (PayPal uses sandbox by default here) */}
      <PayPalScriptProvider options={{ "client-id": "sb", currency: "USD" }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm ticket={ticket} bookingTransaction={bookingTransaction} />
        </Elements>
      </PayPalScriptProvider>
    </div>
  );
}