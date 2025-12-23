import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import flightImage from "../../assets/logo.png"; // product icon

export default function CheckoutPage({ticket, bookingTransaction}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: cardholderName, email },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Authentication required ❌");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/payment/pay/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: ticket?.price || bookingTransaction?.price,
          currency: "usd",
          paymentMethod: paymentMethod.id,
          description: "payment test",
          ...(ticket ? { ticketId: ticket.ticketId } : { bookingTransactionId: bookingTransaction.bookingTransactionId }),
          methodId: 1,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Payment successful 🎉");
      } else {
        setMessage(data.error || "Payment failed ❌");
      }
    } catch (err) {
      setMessage(err.message || "Payment failed ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left side: form */}
        <div className="w-full md:w-1/2 relative animated-gradient flex flex-col items-center justify-center p-10 animate-slide-in">
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/70 to-transparent"></div>

          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition hover:scale-105 relative z-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name on Card</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-blue-400 focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="border rounded-md p-4 bg-gray-50 shadow-sm">
                <CardElement options={{ hidePostalCode: true }} />
              </div>

              <button
                disabled={!stripe || loading}
                className="w-full bg-blue-500 text-white py-3 font-semibold rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>

              {message && (
                <p className="text-sm text-center mt-4 text-red-500">{message}</p>
              )}
            </form>
          </div>
        </div>

        {/* Right side: purchase summary */}
        <div className="hidden md:flex w-1/2 bg-gray-50 relative items-center justify-center animate-slide-in">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/70 to-transparent"></div>

          {/* Bigger summary box with zoom on hover */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full mx-6 transform transition duration-300 hover:scale-105 animated-gradient ">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Summary</h2>

            {/* Product icon */}
            <div className="flex items-center mb-8">
              <img
                src={flightImage}
                alt="Flight Icon"
                className="w-20 h-20 rounded-md mr-6 transition-transform duration-300 hover:scale-110"
              />
              <div>
                <p className="text-xl font-semibold text-gray-700">JetStay Ticket</p>
                <p className="text-sm text-gray-500">Flight ID: #A12345</p>
              </div>
            </div>

            {/* Price details */}
            <div className="space-y-3 text-gray-700 text-lg">
            {ticket && (
                <>
                <div className="flex justify-between font-bold text-2xl">
                    <span>{ticket.airline.name}</span>
                </div>
                <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>${ticket.price}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl">
                    <span>Total</span>
                    <span>${ticket.price}</span>
                </div>

                {/* Extra info */}
                <div className="mt-8 text-sm text-gray-500 space-y-1">
                    <p>Trip: {ticket.tripType.name}</p>
                    <p>Flight: {ticket.flight.departure} → {ticket.flight.arrival}</p>
                    <p>Date: {ticket.flightDate}</p>
                    <p>User: {ticket.user.name} ({ticket.user.email})</p>
                </div>
                </>
            )}
            </div>


            {/* Extra info */}
            <div className="mt-8 text-sm text-gray-500 space-y-1">
              <p>Seat: Economy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}