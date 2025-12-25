import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import flightImage from "../../assets/logo.png";
import { CheckCircle, Loader, ArrowLeft, Plane, Hotel, AlertCircle, Info, Shield, CreditCard } from "lucide-react";

export default function CheckoutPage({ ticket, bookingTransaction }) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // "stripe" or "paypal"
  const [email, setEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const isTicketPayment = Boolean(ticket);
  const isBookingPayment = Boolean(bookingTransaction);

  // Success animation and redirect countdown
  useEffect(() => {
    if (paymentSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentSuccess && countdown === 0) {
      navigate("/");
    }
  }, [paymentSuccess, countdown, navigate]);

  if (!isTicketPayment && !isBookingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-8 inline-block mb-4">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment Request</h2>
          <p className="text-gray-600 mb-6">No booking information found</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all shadow-lg font-semibold"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const amount = isTicketPayment ? ticket.price : bookingTransaction?.totalPrice || 0;

  // ==================== STRIPE PAYMENT ====================
  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded yet. Please wait and try again.");
      return;
    }

    if (!email || !cardholderName) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod: stripePaymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: email,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Card validation failed. Please check your card details.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const body = isTicketPayment
        ? {
            amount: amount,
            currency: "usd",
            paymentMethod: stripePaymentMethod.id,
            description: "Flight ticket payment",
            ticketIds: ticket.ticketIds,
            methodId: 1,
          }
        : {
            amount: amount,
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
        setPaymentSuccess(true);
      } else {
        setError(data.message || data.error || "Payment processing failed. Please contact support.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  // ==================== PAYPAL PAYMENT ====================
  const createPayPalOrder = (data, actions) => {
    setError("");
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: String(amount.toFixed(2)),
          },
          description: isTicketPayment
            ? `Flight ticket - ${ticket.airline.name}`
            : `Hotel booking - ${bookingTransaction.hotel.hotelName}`,
        },
      ],
    });
  };

  const onApprovePayPal = async (data, actions) => {
    setLoading(true);
    setError("");

    try {
      const details = await actions.order.capture();
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const body = isTicketPayment
        ? {
            amount,
            currency: "usd",
            orderId: details.id,
            payer: details.payer,
            description: "Flight ticket payment (PayPal)",
            ticketIds: ticket.ticketIds,
            methodId: 3,
          }
        : {
            amount,
            currency: "usd",
            orderId: details.id,
            payer: details.payer,
            description: "Hotel booking payment (PayPal)",
            bookingTransactionId: bookingTransaction.bookingTransactionId,
            methodId: 3,
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
        setPaymentSuccess(true);
      } else {
        setError(dataRes.message || dataRes.error || "Payment processing failed. Please contact support.");
      }
    } catch (err) {
      console.error("PayPal payment error:", err);
      setError("An unexpected error occurred. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const onCancelPayPal = () => {
    setError("Payment was cancelled. You can try again when ready.");
  };

  const onErrorPayPal = (err) => {
    console.error("PayPal error:", err);
    setError("Payment failed to process. Please try again or use a different payment method.");
  };

  // Success Animation Overlay
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-8 shadow-2xl">
              <CheckCircle className="w-24 h-24 text-white animate-bounce" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Your {isTicketPayment ? "flight tickets" : "hotel booking"} {isTicketPayment ? "have" : "has"} been confirmed
          </p>
          <p className="text-gray-600 mb-8">
            Thank you for choosing JetStay ✨
          </p>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            {isTicketPayment && (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Plane className="w-5 h-5 text-sky-600" />
                  <p className="font-bold text-lg text-gray-800">
                    {ticket.airline.name}
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {ticket.flight.departure} → {ticket.flight.arrival}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${ticket.price.toFixed(2)}
                </p>
              </>
            )}
            {isBookingPayment && (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Hotel className="w-5 h-5 text-sky-600" />
                  <p className="font-bold text-lg text-gray-800">
                    {bookingTransaction.hotel.hotelName}
                  </p>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {bookingTransaction.hotel.city}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {bookingTransaction.numberOfGuests} Guests • {bookingTransaction.numberOfRooms} Room(s)
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ${bookingTransaction.totalPrice.toFixed(2)}
                </p>
              </>
            )}
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-sky-100 to-cyan-100 rounded-xl p-4 mb-6">
            <p className="text-gray-700 text-sm">
              Redirecting to home in{" "}
              <span className="font-bold text-sky-700 text-xl">{countdown}</span> seconds...
            </p>
          </div>

          {/* Manual Navigation Button */}
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all duration-200 shadow-lg font-semibold"
          >
            Return to Home Now
          </button>
        </div>
      </div>
    );
  }

  // Main Payment Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE — PAYMENT SECTION */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 sticky top-8">
                {/* Header with Icon */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Secure Payment
                  </h1>
                  <p className="text-gray-600">
                    Choose your preferred payment method
                  </p>
                </div>

                {/* Payment Amount Card */}
                <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-sky-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                        Total Amount
                      </p>
                      <p className="text-5xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                        ${amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">USD</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      {isTicketPayment ? (
                        <Plane className="w-10 h-10 text-sky-600" />
                      ) : (
                        <Hotel className="w-10 h-10 text-sky-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentMethod("stripe")}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "stripe"
                          ? "border-sky-600 bg-sky-50 text-sky-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                      <span className="font-semibold">Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "paypal"
                          ? "border-sky-600 bg-sky-50 text-sky-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.536c2.82 0 4.742 1.686 4.742 4.157 0 3.235-2.405 5.587-5.835 5.587H9.564l-1.74 8.526a.641.641 0 0 1-.748.5zm11.074-14.831c.746 0 1.316.23 1.316.962 0 1.395-1.097 2.405-2.765 2.405h-.913l.648-3.186h1.714v-.181zm-2.143 9.784c2.82 0 4.742-1.686 4.742-4.157 0-2.472-1.923-4.158-4.742-4.158h-1.97l-1.47 7.215h2.77l.67-3.283h1.007c1.67 0 2.765 1.01 2.765 2.405 0 .732-.57.962-1.316.962h-1.456z"/>
                      </svg>
                      <span className="font-semibold">PayPal</span>
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6 animate-shake">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                          Payment Error
                        </p>
                        <p className="text-xs text-red-700 leading-relaxed">{error}</p>
                      </div>
                      <button
                        onClick={() => setError("")}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <Loader className="w-5 h-5 text-sky-600 animate-spin" />
                      <p className="text-sm font-semibold text-sky-900">
                        Processing your payment...
                      </p>
                    </div>
                  </div>
                )}

                {/* Stripe Payment Form */}
                {paymentMethod === "stripe" && (
                  <form onSubmit={handleStripeSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors"
                        required
                      />
                    </div>

                    {/* Card Element */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Details
                      </label>
                      <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-sky-500 transition-colors">
                        <CardElement
                          options={{
                            hidePostalCode: true,
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#374151",
                                "::placeholder": {
                                  color: "#9CA3AF",
                                },
                              },
                              invalid: {
                                color: "#EF4444",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!stripe || loading}
                      className="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-sky-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
                    </button>
                  </form>
                )}

                {/* PayPal Payment */}
                {paymentMethod === "paypal" && (
                  <div className="space-y-5">
                    {/* Info Box */}
                    <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-sky-900 mb-1">
                            Quick & Secure Checkout
                          </p>
                          <p className="text-xs text-sky-700 leading-relaxed">
                            Click the PayPal button below to complete your payment securely. Your booking will be confirmed instantly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PayPal Button */}
                    <PayPalButtons
                      style={{ layout: "horizontal", height: 48, tagline: false }}
                      createOrder={createPayPalOrder}
                      onApprove={onApprovePayPal}
                      onCancel={onCancelPayPal}
                      onError={onErrorPayPal}
                      disabled={loading}
                      forceReRender={[amount]}
                    />
                  </div>
                )}

                {/* Security Badges */}
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">256-bit SSL Encrypted Payment</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-200">
                    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
                      <svg className="h-6" viewBox="0 0 100 32" fill="none">
                        <path d="M12 4.917v22.166c0 .384-.309.695-.69.695H7.69c-.381 0-.69-.31-.69-.695V4.917c0-.384.309-.695.69-.695h3.62c.381 0 .69.31.69.695z" fill="#003087"/>
                        <path d="M35.666 12.806c0 2.564-2.206 4.298-5.363 4.298h-2.666l-.812 5.018c-.053.324-.333.567-.666.567h-2.993c-.381 0-.69-.31-.69-.695l.053-.324 2.666-16.453c.053-.324.333-.567.666-.567h6.025c2.826 0 4.78 1.734 4.78 4.156zm-4.447 0c0-1.085-.857-1.734-2.302-1.734h-1.953l-.857 5.284h1.906c1.397 0 3.206-.694 3.206-3.55z" fill="#0070E0"/>
                        <path d="M46.666 12.806c0 2.564-2.206 4.298-5.363 4.298h-2.666l-.812 5.018c-.053.324-.333.567-.666.567h-2.993c-.381 0-.69-.31-.69-.695l.053-.324 2.666-16.453c.053-.324.333-.567.666-.567h6.025c2.826 0 4.78 1.734 4.78 4.156zm-4.447 0c0-1.085-.857-1.734-2.302-1.734h-1.953l-.857 5.284h1.906c1.397 0 3.206-.694 3.206-3.55z" fill="#003087"/>
                      </svg>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-2 border border-gray-200">
                      <svg className="h-6" viewBox="0 0 38 24" fill="none">
                        <rect width="38" height="24" rx="3" fill="#0052CC"/>
                        <path d="M19 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#F5F5F5"/>
                        <path d="M15 14c0-1.3.66-2.45 1.66-3.14A4.01 4.01 0 0014 14c0 1.3.66 2.45 1.66 3.14A3.99 3.99 0 0115 14z" fill="#EB001B"/>
                        <path d="M19 10c1.06 0 2.01.41 2.73 1.07A3.99 3.99 0 0123 14c0 1.3-.66 2.45-1.66 3.14A4.01 4.01 0 0119 10z" fill="#F79E1B"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — BOOKING SUMMARY */}
            <div className="order-1 lg:order-2">
              <div className="bg-gradient-to-br from-sky-600 via-cyan-600 to-blue-700 rounded-3xl shadow-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  {isTicketPayment ? (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <Plane className="w-7 h-7" />
                      </div>
                      Flight Booking
                    </>
                  ) : (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <Hotel className="w-7 h-7" />
                      </div>
                      Hotel Booking
                    </>
                  )}
                </h2>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/20">
                  <div className="bg-white p-3 rounded-xl shadow-lg">
                    <img
                      src={flightImage}
                      alt="JetStay Logo"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">JetStay</p>
                    <p className="text-sm text-white/80">Premium Travel Experience</p>
                  </div>
                </div>

                {isTicketPayment && ticket && (
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Airline</p>
                      <p className="text-xl font-bold">{ticket.airline.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">From</p>
                        <p className="text-sm font-bold">{ticket.flight.departure}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">To</p>
                        <p className="text-sm font-bold">{ticket.flight.arrival}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Departure</p>
                      <p className="text-sm font-medium">{ticket.flight.departureTime}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Arrival</p>
                      <p className="text-sm font-medium">{ticket.flight.arrivalTime}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 mt-6 text-gray-900">
                      <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Total Amount</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                        ${ticket.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {isBookingPayment && bookingTransaction && (
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Hotel</p>
                      <p className="text-xl font-bold">{bookingTransaction.hotel.hotelName}</p>
                      <p className="text-sm text-white/80 mt-1">{bookingTransaction.hotel.city}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Guests</p>
                        <p className="text-lg font-bold">{bookingTransaction.numberOfGuests}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Rooms</p>
                        <p className="text-lg font-bold">{bookingTransaction.numberOfRooms}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Check-in</p>
                      <p className="text-sm font-medium">{bookingTransaction.checkInDate}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Check-out</p>
                      <p className="text-sm font-medium">{bookingTransaction.checkOutDate}</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 mt-6 text-gray-900">
                      <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Total Amount</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                        ${bookingTransaction.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 text-center border-t border-white/20 pt-6">
                  <p className="text-sm font-medium">✨ Thank you for choosing JetStay ✨</p>
                  <p className="text-xs text-white/70 mt-2">
                    We're thrilled to be part of your journey!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
