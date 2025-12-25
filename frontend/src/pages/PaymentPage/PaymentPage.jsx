import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  CreditCard,
  CheckCircle,
  Shield,
  Lock,
  Calendar,
  User,
  MapPin,
  Plane,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentPage() {
  const { bookingTransactionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mock data for the view - in a real app this would come from an API based on transactionId
  const orderSummary = {
    total: 342.0,
    subtotal: 290.0,
    taxes: 52.0,
    items: [
      {
        type: "FLIGHT",
        title: "Flight to Paris",
        subtitle: "Economy Class",
        price: 342.0,
      },
    ],
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setSuccess(true);

    // Redirect after a short delay
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 z-0" />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-16 h-16 text-green-600" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-lg mb-8 max-w-md mx-auto"
          >
            Thank you for your booking. You will receive a confirmation email shortly.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sky-600 font-medium"
          >
            <span>Redirecting to home</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sky-100/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-100/50 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Checkout</h1>
            <p className="text-gray-500">Complete your booking securely with SSL encryption</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Payment Section - Left Side */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-sky-600" size={24} />
                  Payment Method
                </h3>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Card Selection */}
                  <div className="flex gap-4 mb-8">
                    <button
                      type="button"
                      className="flex-1 py-4 px-6 border-2 border-sky-600 bg-sky-50 text-sky-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      <CreditCard size={20} />
                      Credit Card
                    </button>
                    <button
                      type="button"
                      className="flex-1 py-4 px-6 border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                    >
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.png"
                        alt="PayPal"
                        className="h-5 opacity-75 grayscale hover:grayscale-0 transition-all"
                      />
                      PayPal
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg shadow-sky-200 hover:shadow-xl hover:shadow-sky-300 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Pay ${orderSummary.total.toFixed(2)}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                    <Lock size={12} className="text-green-600" />
                    Payments are secure and encrypted
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Order Summary - Right Side */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-24">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-6">
                  {orderSummary.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Plane className="text-sky-600" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                        <p className="text-sky-600 font-medium mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="h-px bg-gray-100 my-6" />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${orderSummary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Taxes & Fees</span>
                      <span>${orderSummary.taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                      <span>Total</span>
                      <span>${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {bookingTransactionId && (
                    <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      Transaction ID: {bookingTransactionId}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
