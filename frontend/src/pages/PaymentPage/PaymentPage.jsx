import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { CreditCard, CheckCircle, AlertCircle } from "lucide-react";

export default function PaymentPage() {
  const { bookingTransactionId } = useParams();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    // Get the booking transaction ID from the URL
    if (bookingTransactionId) {
      setTransactionId(bookingTransactionId);
    } else {
      // If no transaction ID, redirect back
      navigate("/");
    }
  }, [bookingTransactionId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Payment Page Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-sky-100 p-4 rounded-full">
                <CreditCard className="w-12 h-12 text-sky-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Payment
            </h1>
            <p className="text-center text-gray-600">
              Complete your booking payment
            </p>
          </div>

          {/* Transaction Info */}
          {transactionId && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Booking Created Successfully
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your booking has been created. Please complete the payment
                    to confirm your reservation.
                  </p>
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      Booking Transaction ID:
                    </p>
                    <p className="text-2xl font-bold text-sky-600">
                      {transactionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Form Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center py-12">
              <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                <AlertCircle className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Payment Integration Coming Soon
              </h3>
              <p className="text-gray-500 mb-6">
                The payment processing feature will be implemented here.
              </p>
              <div className="max-w-md mx-auto text-left bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  This page will include:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Credit card payment form</li>
                  <li>Payment method selection</li>
                  <li>Secure payment processing</li>
                  <li>Payment confirmation</li>
                </ul>
              </div>
            </div>

            {/* Temporary Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all duration-200"
              >
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
