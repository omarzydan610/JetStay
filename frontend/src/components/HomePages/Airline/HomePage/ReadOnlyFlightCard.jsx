import { motion } from "framer-motion";

export default function ReadOnlyFlightCard({ flight }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-default"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300" />

      <div className="relative z-10 space-y-3">
        {/* Route Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-bold text-white">
            {flight.departureAirport?.airportName || flight.departureAirport}
          </h3>
          <span className="text-2xl font-bold text-white opacity-75">→</span>
          <h3 className="text-lg md:text-xl font-bold text-white">
            {flight.arrivalAirport?.airportName || flight.arrivalAirport}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/30" />

        {/* Flight Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Departure */}
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1">DEPARTURE</p>
            <p className="text-white font-semibold">
              {new Date(flight.departureDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-white/90 text-xs">
              {new Date(flight.departureDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          {/* Arrival */}
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1">ARRIVAL</p>
            <p className="text-white font-semibold">
              {new Date(flight.arrivalDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-white/90 text-xs">
              {new Date(flight.arrivalDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/30" />

        {/* Status and Plane Info */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Status */}
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1">STATUS</p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  flight.status === "ON_TIME"
                    ? "bg-green-300 text-green-900"
                    : flight.status === "PENDING"
                    ? "bg-yellow-300 text-yellow-900"
                    : "bg-red-300 text-red-900"
                }`}
              >
                {flight.status}
              </span>
            </div>
          </div>

          {/* Plane Type */}
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1">AIRCRAFT</p>
            <p className="text-white font-semibold text-sm">
              {flight.planeType || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
