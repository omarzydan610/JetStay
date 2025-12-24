import { motion, AnimatePresence } from "framer-motion";
import { X, Plane, MessageSquare } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import AirlineReviews from "../FlightReview/AirlineReviewsList";
import { getPublicFlightOffers } from "../../../../services/Airline/flightsService";
import {
  isOfferActive,
  calculateDiscountedPrice,
  formatPriceDisplay,
  getOfferBadgeText
} from "../../../../utils/offerUtils";

export default function FlightDetailsPanel({ flight, onClose }) {
  const [selectedTripTypeIndex, setSelectedTripTypeIndex] = useState(null);
  const [flightOffers, setFlightOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  // Reset selected trip type when flight changes
  useEffect(() => {
    setSelectedTripTypeIndex(null);
  }, [flight?.flightID]);

  // Fetch flight offers when flight changes
  useEffect(() => {
    const fetchFlightOffers = async () => {
      if (!flight?.flightID) return;

      setLoadingOffers(true);
      try {
        const response = await getPublicFlightOffers(flight.flightID);

        // Handle the API response structure
        if (response && response.success && Array.isArray(response.data)) {
          setFlightOffers(response.data);
        } else {
          // If response has unexpected structure, use empty array
          console.warn('Unexpected API response structure:', response);
          setFlightOffers([]);
        }
      } catch (error) {
        console.error("Error fetching flight offers:", error);
        setFlightOffers([]);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchFlightOffers();
  }, [flight?.flightID]);

  const formatTime = useCallback((iso) => {
    try {
      return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "-";
    }
  }, []);

  const formatDate = useCallback((iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch {
      return "-";
    }
  }, []);

  const getDuration = useCallback((departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    const diff = new Date(arrival) - new Date(departure);
    if (isNaN(diff)) return "N/A";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }, []);

  const getAirportCode = useCallback((airportName) => {
    if (!airportName) return "---";
    const match = airportName.match(/\(([^)]+)\)/);
    return match ? match[1] : airportName.substring(0, 3).toUpperCase();
  }, []);

  // Helper function to get active offers safely
  const getActiveOffers = useCallback(() => {
    if (!Array.isArray(flightOffers)) return [];
    return flightOffers.filter(offer => {
      // Check if offer has required properties and is active
      if (!offer || typeof offer !== 'object') return false;

      // Use isActive flag from API response
      if (offer.isActive !== undefined) {
        return offer.isActive === true;
      }

      // Fallback to isOfferActive utility if isActive flag not present
      return isOfferActive(offer);
    });
  }, [flightOffers]);

  const getBestOfferForPrice = useCallback((price) => {
    const activeOffers = getActiveOffers();
    if (activeOffers.length === 0) return null;

    // For simplicity, return the first active offer
    // Could be improved to find the best discount or match criteria
    return activeOffers[0];
  }, [getActiveOffers]);

  const departureCode = getAirportCode(flight?.departureAirport?.airportName);
  const arrivalCode = getAirportCode(flight?.arrivalAirport?.airportName);
  const duration = getDuration(flight?.departureDate, flight?.arrivalDate);

  const handleBooking = useCallback(() => {
    if (selectedTripTypeIndex !== null) {
      const tripTypes = flight?.tripTypes || flight?.tripsTypes || [];
      const selectedTripType = tripTypes[selectedTripTypeIndex];
      const bestOffer = getBestOfferForPrice(selectedTripType?.price || 0);

      let bookingMessage = `Booking ${selectedTripType.typeName || selectedTripType.name} on ${flight?.airline?.airlineName || "Flight"
        }`;

      if (bestOffer) {
        bookingMessage += ` with "${bestOffer.offerName}" offer (${bestOffer.discountValue}% off)`;
      }

      toast.success(bookingMessage);
    }
  }, [selectedTripTypeIndex, flight, getBestOfferForPrice]);

  // Calculate active offers count
  const activeOffers = getActiveOffers();
  const activeOffersCount = activeOffers.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 bottom-0 w-full md:w-2/5 bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
      >
        {/* Header with Flight Info */}
        <div className="relative h-80 bg-gradient-to-br from-sky-500 to-cyan-500 flex items-end text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition z-10"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="relative z-10 p-8 w-full">
            {/* Airline Info with Reviews Button */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold text-2xl overflow-hidden">
                  {flight?.airline?.logoUrl ? (
                    <img
                      src={flight.airline.logoUrl}
                      alt={flight?.airline?.airlineName || "Airline"}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<span class="text-white text-xl font-bold">${flight?.airline?.airlineName
                          ?.substring(0, 2)
                          .toUpperCase() || "XX"
                          }</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {flight?.airline?.airlineName
                        ?.substring(0, 2)
                        .toUpperCase() || "XX"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {flight?.airline?.airlineName}
                  </div>
                  <div className="text-white/80 text-sm">
                    {flight?.airline?.airlineNationality || "International"}
                  </div>
                </div>
              </div>

              {/* View Reviews Button */}
              <button
                onClick={() => setShowReviews(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors font-medium text-sm"
              >
                <MessageSquare size={18} />
                <span className="hidden sm:inline">Reviews</span>
              </button>
            </div>

            {/* Route & Duration */}
            <div className="flex items-center justify-between mt-6">
              <div>
                <div className="text-sm text-white/80 mb-1">From</div>
                <div className="text-3xl font-bold">{departureCode}</div>
                <div className="text-sm text-white/80 mt-1">
                  {flight?.departureAirport?.city}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Plane size={28} className="mb-2" />
                <div className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                  {duration}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-white/80 mb-1">To</div>
                <div className="text-3xl font-bold">{arrivalCode}</div>
                <div className="text-sm text-white/80 mt-1">
                  {flight?.arrivalAirport?.city}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Offers Banner */}
          {activeOffersCount > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-800 font-bold mb-1">
                    🎉 Special Offers Available!
                  </div>
                  <div className="text-green-700 text-sm">
                    {activeOffersCount} active offer{activeOffersCount !== 1 ? 's' : ''} for this flight
                  </div>
                </div>
                {loadingOffers && (
                  <div className="text-green-600 text-sm">
                    Loading offers...
                  </div>
                )}
              </div>
              {activeOffers.slice(0, 2).map((offer, index) => (
                <div key={index} className="mt-2 text-sm text-green-600">
                  • {offer.offerName}: {offer.discountValue}% off
                </div>
              ))}
            </div>
          )}

          {/* Date and Time */}
          <div className="bg-sky-50 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">Flight Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-600 font-semibold mb-1">
                  Departure
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {formatDate(flight?.departureDate)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(flight?.departureDate)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 font-semibold mb-1">
                  Arrival
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {formatDate(flight?.arrivalDate)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(flight?.arrivalDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Aircraft Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">Aircraft & Route</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aircraft Type:</span>
                <span className="font-semibold text-gray-800">
                  {flight?.planeType || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">From:</span>
                <span className="font-semibold text-gray-800">
                  {flight?.departureAirport?.airportName || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">To:</span>
                <span className="font-semibold text-gray-800">
                  {flight?.arrivalAirport?.airportName || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Trip Types */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Select Trip Type
              </h2>
              {activeOffersCount > 0 && (
                <div className="text-sm text-green-600 font-semibold">
                  {activeOffersCount} active offer{activeOffersCount !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {loadingOffers ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
                <div className="mt-2 text-gray-600 text-sm">Loading offers...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {(flight?.tripTypes || flight?.tripsTypes || []).length > 0 ? (
                  (flight?.tripTypes || flight?.tripsTypes || []).map(
                    (tripType, index) => {
                      const isSelected = selectedTripTypeIndex === index;
                      const originalPrice = tripType.price || 0;
                      const bestOffer = getBestOfferForPrice(originalPrice);
                      const discountedPrice = bestOffer ? calculateDiscountedPrice(originalPrice, bestOffer.discountValue) : originalPrice;
                      const priceDisplay = formatPriceDisplay(originalPrice, bestOffer ? discountedPrice : null);

                      return (
                        <motion.div
                          key={tripType.tripTypeID || index}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedTripTypeIndex(index)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition relative ${isSelected
                            ? "border-sky-600 bg-sky-50"
                            : "border-gray-200 bg-white"
                            }`}
                        >
                          {bestOffer && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {getOfferBadgeText(bestOffer.discountValue)}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-bold text-gray-800 mb-1">
                                {tripType.typeName || tripType.name || "Trip Type"}
                              </div>
                              {tripType.description && (
                                <div className="text-sm text-gray-600">
                                  {tripType.description}
                                </div>
                              )}
                              {bestOffer && (
                                <div className="mt-2">
                                  <div className="text-sm text-green-600 font-semibold">
                                    🎁 {bestOffer.offerName}
                                  </div>
                                  <div className="text-xs text-green-500">
                                    Save ${priceDisplay.savings?.toFixed(2)} ({bestOffer.discountValue}% off)
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right min-w-fit ml-4">
                              <div className="text-xs text-gray-600 mb-1">
                                Price
                              </div>
                              <div className="flex flex-col items-end">
                                {bestOffer ? (
                                  <>
                                    <div className="text-lg text-gray-500 line-through">
                                      ${originalPrice.toFixed(2)}
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                      ${discountedPrice.toFixed(2)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-2xl font-bold text-sky-600">
                                    ${originalPrice.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )
                ) : (
                  <div className="text-center py-6 text-gray-600">
                    No trip types available for this flight
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Button */}
          <div className="p-6 border-t-2 border-gray-200 bg-gray-50 space-y-3">
            <div className="bg-white rounded-lg p-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Price:</span>
              <span className="text-2xl font-bold text-sky-600">
                {selectedTripTypeIndex !== null
                  ? (() => {
                    const tripType = (flight?.tripTypes || flight?.tripsTypes || [])[selectedTripTypeIndex];
                    const originalPrice = tripType?.price || 0;
                    const bestOffer = getBestOfferForPrice(originalPrice);
                    const finalPrice = bestOffer ? calculateDiscountedPrice(originalPrice, bestOffer.discountValue) : originalPrice;
                    return `$${finalPrice.toFixed(2)}`;
                  })()
                  : "$0.00"}
              </span>
            </div>

            <button
              disabled={selectedTripTypeIndex === null}
              onClick={handleBooking}
              className={`w-full py-3 rounded-lg font-bold text-lg transition ${selectedTripTypeIndex !== null
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {selectedTripTypeIndex !== null
                ? "Book Flight"
                : "Select a Trip Type"}
            </button>
          </div>
        </div>

        {/* Reviews Modal */}
        <AnimatePresence>
          {showReviews && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviews(false)}
                className="fixed inset-0 bg-black/50 z-[60]"
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-4 md:inset-10 lg:inset-20 bg-white rounded-lg shadow-2xl z-[70] flex flex-col overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Airline Reviews - {flight?.airline?.airlineName}
                  </h2>
                  <button
                    onClick={() => setShowReviews(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto">
                  <AirlineReviews
                    airlineId={flight?.airline?.airlineID}
                    airlineName={flight?.airline?.airlineName}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}