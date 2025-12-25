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

  const { ticket, bookingTransaction, type, bookingData } = location.state || {};
  console.log("Payment Page - Ticket:", ticket);
  console.log("Payment Page - Booking Transaction:", bookingTransaction);
  console.log("Payment Page - Type:", type);
  console.log("Payment Page - Booking Data:", bookingData);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Stripe Elements + PayPal provider (PayPal uses sandbox by default here) */}
      <PayPalScriptProvider options={{ "client-id": "sb", currency: "USD" }}>
        <Elements stripe={stripePromise}>
          <CheckoutForm ticket={ticket} bookingTransaction={bookingTransaction} bookingData={bookingData} />
        </Elements>
      </PayPalScriptProvider>
    </div>
  );
}