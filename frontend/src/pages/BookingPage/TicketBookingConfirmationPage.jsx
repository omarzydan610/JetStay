import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Plane,
  CreditCard,
  CheckCircle,
  Calendar,
  Clock,
  Users,
  Tag,
  MapPin,
} from "lucide-react";

export default function TicketBookingConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get booking confirmation data from navigation state
  const { ticketData, flight, selectedTripType, appliedOffer, quantity } =
    location.state || {};

  useEffect(() => {
    // Redirect to home if no booking data
    if (!ticketData || !flight) {
      navigate("/");
    }
  }, [ticketData, flight, navigate]);

  if (!ticketData || !flight) {
    return null;
  }

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        weekday: "long",
      });
    } catch {
      return "-";
    }
  };

  const getDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    const diff = new Date(arrival) - new Date(departure);
    if (isNaN(diff)) return "N/A";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  const getAirportCode = (airportName) => {
    if (!airportName) return "---";
    const match = airportName.match(/\(([^)]+)\)/);
    return match ? match[1] : airportName.substring(0, 3).toUpperCase();
  };

  const handleProceedToPayment = () => {
    setLoading(true);
    // Navigate to payment page with ticket data
    navigate("/payment", {
      state: {
        ticket: ticketData,
      },
    });
  };

  const departureCode = getAirportCode(flight.departureAirport?.airportName);
  const arrivalCode = getAirportCode(flight.arrivalAirport?.airportName);
  const duration = getDuration(flight.departureDate, flight.arrivalDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Your flight tickets have been successfully booked.
            </p>
            {ticketData.ticketIds && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                <p className="text-sm font-semibold text-green-900">
                  Booking Reference
                </p>
                <p className="text-lg font-mono text-green-700">
                  {ticketData.ticketIds.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Flight Information Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Airline Logo */}
              <div className="w-20 h-20 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {flight.airline?.logoUrl ? (
                  <img
                    src={flight.airline.logoUrl}
                    alt={flight.airline.airlineName}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Plane className="w-10 h-10 text-sky-600" />
                )}
              </div>

              {/* Flight Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {flight.airline?.airlineName || "Flight Booking"}
                </h2>
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="text-2xl font-bold text-sky-600">
                        {departureCode}
                      </p>
                      <p className="text-xs text-gray-500">
                        {flight.departureAirport?.city}
                      </p>
                    </div>
                    <div className="px-4">
                      <Plane className="w-6 h-6 text-gray-400" />
                      <p className="text-xs text-gray-500 text-center mt-1">
                        {duration}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">To</p>
                      <p className="text-2xl font-bold text-sky-600">
                        {arrivalCode}
                      </p>
                      <p className="text-xs text-gray-500">
                        {flight.arrivalAirport?.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Departure and Arrival Info */}
                <div className="grid grid-cols-2 gap-4 bg-sky-50 rounded-lg p-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <p className="text-xs font-semibold text-gray-700">
                        Departure
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      {formatDate(flight.departureDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        {formatTime(flight.departureDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-sky-600" />
                      <p className="text-xs font-semibold text-gray-700">
                        Arrival
                      </p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      {formatDate(flight.arrivalDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        {formatTime(flight.arrivalDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Booking Details
            </h3>
            <div className="space-y-4">
              {/* Class/Trip Type */}
              {selectedTripType && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Class</p>
                      <p className="font-semibold text-gray-800">
                        {selectedTripType.typeName || selectedTripType.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-sky-600">
                    ${selectedTripType.price?.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Number of Tickets */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Number of Tickets</p>
                    <p className="font-semibold text-gray-800">{quantity}</p>
                  </div>
                </div>
              </div>

              {/* Applied Offer */}
              {appliedOffer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Tag className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-green-800">
                        {appliedOffer.offerName}
                      </p>
                      <p className="text-sm text-green-600">
                        {appliedOffer.discountValue}% discount applied
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Total Price */}
              <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-sky-700">
                      ${ticketData.price.toFixed(2)}
                    </p>
                    {appliedOffer && (
                      <p className="text-sm text-green-600 mt-1">
                        You saved ${((selectedTripType.price * quantity) - ticketData.price).toFixed(2)}!
                      </p>
                    )}
                  </div>
                  <CreditCard className="w-12 h-12 text-sky-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/")}
              className="py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center font-semibold"
            >
              Back to Home
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>

          {/* Important Note */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> Your tickets are reserved but not
              confirmed until payment is completed. Please proceed to payment to
              secure your booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
