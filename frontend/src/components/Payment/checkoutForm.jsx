import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalButtons } from "@paypal/react-paypal-js";
import flightImage from "../../assets/logo.png";

export default function CheckoutPage({ ticket, bookingTransaction }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe"); // 'stripe' | 'paypal'

  const isTicketPayment = Boolean(ticket);
  const isBookingPayment = Boolean(bookingTransaction);

  if (!isTicketPayment && !isBookingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-xl">Invalid payment request ❌</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      if (paymentMethod === "paypal") {
        // PayPal flow is handled by PayPalButtons below.
        setMessage("Please complete payment using the PayPal button below.");
        setLoading(false);
        return;
      }
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod: stripePaymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          email,
        },
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

      const body = isTicketPayment
        ? {
            amount: ticket.price,
            currency: "usd",
            paymentMethod: stripePaymentMethod.id,
            description: "Flight ticket payment",
            ticketId: ticket.ticketId,
            methodId: 1,
          }
        : {
            amount: bookingTransaction.totalPrice,
            currency: "usd",
            paymentMethod: stripePaymentMethod.id,
            description: "Hotel booking payment",
            bookingTransactionId: bookingTransaction.bookingTransactionId,
            methodId: 1,
          };
      const routeSuffix = isTicketPayment ? "ticket" : "room";
      const response = await fetch(
        `http://localhost:8080/api/payment/pay/${routeSuffix}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

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

  const amount = isTicketPayment ? ticket.price : bookingTransaction?.totalPrice || 0;

  const createPayPalOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(amount),
          },
        },
      ],
    });
  };

  const onApprovePayPal = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setMessage("Authentication required ❌");
        return;
      }

      const body = isTicketPayment
        ? {
            amount,
            currency: "usd",
            orderId: details.id,
            payer: details.payer,
            description: "Flight ticket payment (PayPal)",
            ticketId: ticket.ticketId,
            methodId: 2,
          }
        : {
            amount,
            currency: "usd",
            orderId: details.id,
            payer: details.payer,
            description: "Hotel booking payment (PayPal)",
            bookingTransactionId: bookingTransaction.bookingTransactionId,
            methodId: 2,
          };

      const routeSuffix = isTicketPayment ? "ticket" : "room";
      const response = await fetch(
        `http://localhost:8080/api/payment/paypal/${routeSuffix}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const dataRes = await response.json();
      if (response.ok) {
        setMessage("Payment successful 🎉");
      } else {
        setMessage(dataRes.error || "Payment failed ❌");
      }
    } catch (err) {
      setMessage(err.message || "PayPal payment failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* LEFT SIDE — PAYMENT FORM */}
        <div className="w-full md:w-1/2 relative bg-gradient-to-br from-white via-blue-100 to-black-100 flex flex-col items-center justify-center p-12 animated-gradient">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 transform transition duration-300 hover:scale-105">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-800 tracking-tight">
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Default: show Stripe card form. PayPal option is below the submit button. */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name on Card
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 mt-1 focus:ring-indigo-400 focus:border-indigo-400"
                />
              </div>

              <div className="border rounded-md p-4 bg-gray-50 shadow-sm">
                {paymentMethod === "stripe" ? (
                  <CardElement options={{ hidePostalCode: true }} />
                ) : (
                  <div className="text-center text-sm text-gray-600">
                    Use the PayPal button below to complete the payment.
                  </div>
                )}
              </div>

              {paymentMethod === "stripe" ? (
                <button
                  disabled={!stripe || loading}
                  className="w-full bg-indigo-600 text-white py-3 font-semibold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              ) : null}

              {/* PayPal alternative below submit */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Or pay with PayPal</p>
                <div className="inline-block">
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={createPayPalOrder}
                    onApprove={onApprovePayPal}
                    forceReRender={[amount]}
                    onClick={(data, actions) => {
                      const fs = data && data.fundingSource ? String(data.fundingSource).toLowerCase() : "";
                      if (fs.includes("card") || fs.includes("credit") || fs.includes("debit")) {
                        // user chose Debit/Credit — switch to Stripe card form
                        setPaymentMethod("stripe");
                        setMessage("You selected card — switching to Stripe payment form.");
                        if (actions && typeof actions.reject === "function") {
                          return actions.reject();
                        }
                        return;
                      }
                      // proceed with PayPal account flow
                      setPaymentMethod("paypal");
                      return;
                    }}
                  />
                  {paymentMethod === "paypal" && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod("stripe");
                          setMessage("");
                        }}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Pay with card instead
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message && (
                <p className="text-sm text-center mt-4 text-red-500">
                  {message}
                </p>
              )}
            </form>
          </div>

          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-white rounded-full shadow hover:scale-105 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-12 bg-gradient-to-bl from-white via-blue-100 to-black-100 animated-gradient">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl 
          p-12 max-w-xl w-full transform transition duration-300 hover:scale-110 relative z-20 
          animate-slide-in">
            <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 tracking-tight">
              Your Booking
            </h2>

            <div className="flex items-center mb-10">
              <img
                src={flightImage}
                alt="Icon"
                className="w-24 h-24 mr-6 rounded-xl transition-transform duration-300 hover:scale-125"
              />
              <div>
                <p className="text-2xl font-semibold text-gray-800">JetStay</p>
                <p className="text-sm text-gray-500">Premium Travel Experience</p>
              </div>
            </div>

            {isTicketPayment && (
              <>
                <p className="font-bold text-xl text-gray-800">
                  {ticket.airline.name}
                </p>
                <p className="text-gray-600">
                  {ticket.flight.departure} → {ticket.flight.arrival}
                </p>
                <p className="text-gray-600">
                  Departure: {ticket.flight.departureTime}
                </p>
                <p className="text-gray-600">
                  Arrival: {ticket.flight.arrivalTime}
                </p>
                <p className="font-bold text-3xl mt-6 text-indigo-700">
                  ${ticket.price}
                </p>
              </>
            )}

            {isBookingPayment && (
              <>
                <p className="font-bold text-xl text-gray-800">
                  {bookingTransaction.hotel.hotelName}
                </p>
                <p className="text-gray-600">{bookingTransaction.hotel.city}</p>
                <p className="text-gray-600">
                  {bookingTransaction.numberOfGuests} Guests
                </p>
                <p className="text-gray-600">
                  Rooms: {bookingTransaction.numberOfRooms}
                </p>
                <p className="text-gray-600">
                  Check-In: {bookingTransaction.checkInDate}
                </p>
                <p className="text-gray-600">
                  Check-Out: {bookingTransaction.checkOutDate}
                </p>
                <p className="font-bold text-3xl mt-6 text-indigo-700">
                  ${bookingTransaction.totalPrice}
                </p>
              </>
            )}

            {/* Thank-you message */}
            <div className="mt-10 text-center text-gray-600 italic">
              <p>✨ Thank you for choosing JetStay ✨</p>
              <p className="text-sm text-gray-500 mt-2">
                We’re thrilled to be part of your journey!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}