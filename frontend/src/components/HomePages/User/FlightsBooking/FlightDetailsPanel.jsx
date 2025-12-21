import { motion } from "framer-motion";
import { X, Plane } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function FlightDetailsPanel({ flight, onClose }) {
  const [selectedTripTypeIndex, setSelectedTripTypeIndex] = useState(null);

  // Reset selected trip type when flight changes
  useEffect(() => {
    setSelectedTripTypeIndex(null);
  }, [flight?.flightID]);

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

  const departureCode = getAirportCode(flight?.departureAirport?.airportName);
  const arrivalCode = getAirportCode(flight?.arrivalAirport?.airportName);
  const duration = getDuration(flight?.departureDate, flight?.arrivalDate);

  const handleBooking = () => {
    if (selectedTripTypeIndex !== null) {
      const tripTypes = flight?.tripTypes || flight?.tripsTypes || [];
      const selectedTripType = tripTypes[selectedTripTypeIndex];
      toast.success(
        `Booking ${selectedTripType.typeName || selectedTripType.name} on ${
          flight?.airline?.airlineName || "Flight"
        }`
      );
    }
  };

  return (
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
          {/* Airline Info */}
          <div className="mb-4 flex items-center gap-3">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold text-2xl overflow-hidden">
              {flight?.airline?.logoUrl ? (
                <img
                  src={flight.airline.logoUrl}
                  alt={flight?.airline?.airlineName || "Airline"}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<span class="text-white text-xl font-bold">${
                      flight?.airline?.airlineName
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

      {/* Flight Details */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Date and Time */}
        <div className="bg-sky-50 rounded-lg p-4 space-y-3">
          <h3 className="font-bold text-gray-800 text-sm">Flight Details</h3>
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
            <div>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Select Trip Type
          </h2>
          <div className="space-y-3">
            {(flight?.tripTypes || flight?.tripsTypes || []).length > 0 ? (
              (flight?.tripTypes || flight?.tripsTypes || []).map(
                (tripType, index) => {
                  const isSelected = selectedTripTypeIndex === index;
                  return (
                    <motion.div
                      key={tripType.tripTypeID || index}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedTripTypeIndex(index)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        isSelected
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
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
                        </div>
                        <div className="text-right min-w-fit ml-4">
                          <div className="text-xs text-gray-600 mb-1">
                            Price
                          </div>
                          <div className="text-2xl font-bold text-sky-600">
                            $
                            {tripType.price?.toFixed
                              ? tripType.price.toFixed(2)
                              : Number(tripType.price || 0).toFixed(2)}
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
        </div>
      </div>

      {/* Booking Button */}
      <div className="p-6 border-t-2 border-gray-200 bg-gray-50 space-y-3">
        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Price:</span>
          <span className="text-2xl font-bold text-sky-600">
            {selectedTripTypeIndex !== null
              ? `$${
                  (flight?.tripTypes || flight?.tripsTypes || [])[
                    selectedTripTypeIndex
                  ]?.price?.toFixed
                    ? (flight?.tripTypes || flight?.tripsTypes || [])[
                        selectedTripTypeIndex
                      ].price.toFixed(2)
                    : Number(
                        (flight?.tripTypes || flight?.tripsTypes || [])[
                          selectedTripTypeIndex
                        ]?.price || 0
                      ).toFixed(2)
                }`
              : "$0.00"}
          </span>
        </div>

        <button
          disabled={selectedTripTypeIndex === null}
          onClick={handleBooking}
          className={`w-full py-3 rounded-lg font-bold text-lg transition ${
            selectedTripTypeIndex !== null
              ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:from-sky-700 hover:to-cyan-700 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedTripTypeIndex !== null
            ? "Book Flight"
            : "Select a Trip Type"}
        </button>
      </div>
    </motion.div>
  );
}
