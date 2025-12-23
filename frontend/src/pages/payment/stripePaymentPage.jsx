import CheckoutForm from "../../components/Payment/checkoutForm.jsx";
import { useLocation } from "react-router-dom";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SgUkj2MZSsaVhaf1ENZ4AtX5clx7JEzXOEOCfd4qpS20MIVZ2vqZwFJ43QHVfGvsREfsJfZ19KBxPq78Ja405Qu00X5PSI8JO");

export default function StripePaymentPage() {
  const location = useLocation();
  const { ticket } = location.state || {};
  console.log("Ticket data in StripePaymentPage:", ticket);
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm ticket={ticket} />
    </Elements>
  );
}