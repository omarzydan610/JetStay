import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import ticketBookingService from "../../services/AirlineServices/ticketBookingService";
import Navbar from "../../components/Navbar";
import { calculateDiscountedPrice } from "../../utils/offerUtils";
import {
  Plane,
  CreditCard,
  ArrowLeft,
  Calendar,
  Users,
  Clock,
  Tag,
} from "lucide-react";

export default function TicketBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Get flight, trip type, and offer from navigation state
  const { flight, selectedTripType, appliedOffer } = location.state || {};

  const [quantity, setQuantity] = useState(1);

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

  const calculateTotalPrice = () => {
    if (!selectedTripType?.price) return 0;
    const basePrice = selectedTripType.price;
    const pricePerTicket = appliedOffer
      ? calculateDiscountedPrice(basePrice, appliedOffer.discountValue)
      : basePrice;
    return pricePerTicket * quantity;
  };

  const getPricePerTicket = () => {
    if (!selectedTripType?.price) return 0;
    return appliedOffer
      ? calculateDiscountedPrice(
          selectedTripType.price,
          appliedOffer.discountValue
        )
      : selectedTripType.price;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!flight || !selectedTripType) {
      toast.error("Flight or trip type information is missing");
      return;
    }

    if (quantity < 1) {
      toast.error("Please select at least one ticket");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        airlineId: flight.airline?.airlineID,
        flightId: flight.flightID,
        tripTypeId: selectedTripType.typeID,
        quantity: quantity,
      };

      // Debug: Log the booking data to check for missing values
      console.log("Booking Data:", bookingData);
      console.log("Flight Data:", flight);
      console.log("Selected Trip Type:", selectedTripType);

      // Validate that all required IDs are present
      if (!bookingData.airlineId) {
        toast.error(
          "Airline ID is missing. Please try selecting the flight again."
        );
        setLoading(false);
        return;
      }
      if (!bookingData.flightId) {
        toast.error(
          "Flight ID is missing. Please try selecting the flight again."
        );
        setLoading(false);
        return;
      }
      if (!bookingData.tripTypeId) {
        toast.error(
          "Trip Type ID is missing. Please try selecting the trip type again."
        );
        setLoading(false);
        return;
      }

      // Call booking API
      const ticketIds = await ticketBookingService.createTicketBooking(
        bookingData
      );

      toast.success("Tickets booked successfully!");

      // Prepare ticket data for payment page
      const departureCode = getAirportCode(
        flight.departureAirport?.airportName
      );
      const arrivalCode = getAirportCode(flight.arrivalAirport?.airportName);

      const ticketData = {
        ticketId: ticketIds[0], // Using first ticket ID for payment
        ticketIds: ticketIds, // Store all ticket IDs
        price: calculateTotalPrice(),
        airline: {
          name: flight.airline?.airlineName || "Airline",
        },
        flight: {
          departure: `${departureCode} (${
            flight.departureAirport?.city || ""
          })`,
          arrival: `${arrivalCode} (${flight.arrivalAirport?.city || ""})`,
          departureTime:
            formatDate(flight.departureDate) +
            " at " +
            formatTime(flight.departureDate),
          arrivalTime:
            formatDate(flight.arrivalDate) +
            " at " +
            formatTime(flight.arrivalDate),
        },
      };

      // Navigate to booking confirmation page first
      navigate("/booking/ticket/confirmation", {
        state: {
          ticketData: ticketData,
          flight: flight,
          selectedTripType: selectedTripType,
          appliedOffer: appliedOffer,
          quantity: quantity,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to book tickets. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const departureCode = getAirportCode(flight?.departureAirport?.airportName);
  const arrivalCode = getAirportCode(flight?.arrivalAirport?.airportName);
  const duration = getDuration(flight?.departureDate, flight?.arrivalDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Flight Information Card */}
          {flight && (
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

                  {/* Selected Trip Type */}
                  {selectedTripType && (
                    <div
                      className={`mt-4 rounded-lg p-4 ${
                        appliedOffer
                          ? "bg-green-50 border border-green-200"
                          : "bg-cyan-50 border border-cyan-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold mb-1 ${
                          appliedOffer ? "text-green-900" : "text-cyan-900"
                        }`}
                      >
                        Selected Class:
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              appliedOffer ? "text-green-700" : "text-cyan-700"
                            }`}
                          >
                            {selectedTripType.typeName || selectedTripType.name}
                          </p>
                          {selectedTripType.description && (
                            <p
                              className={`text-sm ${
                                appliedOffer
                                  ? "text-green-600"
                                  : "text-cyan-600"
                              }`}
                            >
                              {selectedTripType.description}
                            </p>
                          )}
                          {appliedOffer && (
                            <div className="mt-2 flex items-center gap-1">
                              <Tag className="w-4 h-4 text-green-600" />
                              <p className="text-xs font-semibold text-green-600">
                                {appliedOffer.offerName} (
                                {appliedOffer.discountValue}% OFF)
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {appliedOffer ? (
                            <>
                              <p className="text-sm text-gray-500 line-through">
                                ${selectedTripType.price?.toFixed(2)}
                              </p>
                              <p className="text-2xl font-bold text-green-700">
                                ${getPricePerTicket().toFixed(2)}
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-cyan-700">
                              ${selectedTripType.price?.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Plane className="w-8 h-8 text-sky-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-800">
                  Complete Your Booking
                </h1>
              </div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Number of Tickets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Number of Tickets *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 10 tickets per booking
                </p>
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

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-bold text-gray-800 mb-4">Price Summary</h3>

                {appliedOffer ? (
                  <>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Original price per ticket:</span>
                      <span className="font-semibold line-through text-gray-500">
                        ${selectedTripType?.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-green-700">
                      <span>Discounted price per ticket:</span>
                      <span className="font-semibold">
                        ${getPricePerTicket().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Number of tickets:</span>
                      <span className="font-semibold">{quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600 text-sm">
                      <span>Total savings:</span>
                      <span className="font-semibold">
                        -$
                        {(
                          (selectedTripType?.price - getPricePerTicket()) *
                          quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Price per ticket:</span>
                      <span className="font-semibold">
                        ${selectedTripType?.price?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Number of tickets:</span>
                      <span className="font-semibold">{quantity}</span>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total:
                    </span>
                    <span
                      className={`text-2xl font-bold ${
                        appliedOffer ? "text-green-600" : "text-sky-600"
                      }`}
                    >
                      ${calculateTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
