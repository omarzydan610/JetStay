import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function FlightSearchCard({ flight, onClick }) {
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

  const getAirportCode = (airportName) => {
    if (!airportName) return "---";
    const match = airportName.match(/\(([^)]+)\)/);
    return match ? match[1] : airportName.substring(0, 3).toUpperCase();
  };

  const getDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    const diff = new Date(arrival) - new Date(departure);
    if (isNaN(diff)) return "N/A";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  const departureCode = getAirportCode(flight?.departureAirport?.airportName);
  const arrivalCode = getAirportCode(flight?.arrivalAirport?.airportName);
  const duration = getDuration(flight?.departureDate, flight?.arrivalDate);
  const minPrice = flight.tripTypes
    ? Math.min(...flight.tripTypes.map((t) => t.price || 0))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group bg-white rounded-xl border border-sky-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Airline Logo & Info */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {flight?.airline?.logoUrl ? (
                <img
                  src={flight.airline.logoUrl}
                  alt={flight?.airline?.airlineName || "Airline"}
                  className="w-full h-full object-contain p-1"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="text-xs font-bold text-gray-600">
                  {flight?.airline?.airlineName
                    ?.substring(0, 2)
                    .toUpperCase() || "XX"}
                </div>
              )}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {flight?.airline?.airlineName || "Unknown Airline"}
            </div>
          </div>

          {/* Flight Route */}
          <div className="flex items-center gap-2 flex-1">
            <div className="text-center">
              <div className="text-lg font-bold text-sky-600">
                {departureCode}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(flight?.departureDate)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 flex-1">
              <Plane size={18} className="text-sky-400" />
              <div className="text-xs font-semibold text-gray-600">
                {duration}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-sky-600">
                {arrivalCode}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(flight?.arrivalDate)}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right min-w-fit">
            <div className="text-xs text-gray-500 mb-1">FROM</div>
            <div className="text-2xl font-bold text-sky-600">
              ${minPrice.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Action */}
      <div className="h-1 bg-gradient-to-r from-sky-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
