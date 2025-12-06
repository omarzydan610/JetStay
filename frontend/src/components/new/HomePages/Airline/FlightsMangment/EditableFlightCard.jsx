import { motion } from "framer-motion";
import { useState } from "react";

export default function EditableFlightCard({
  flight,
  onEdit,
  onDelete,
  isDeleting,
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Action Buttons Overlay */}
      {isHovering && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-4 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(flight)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            ✎ Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(flight.flightID)}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 transition"
          >
            {isDeleting ? "Deleting..." : "🗑 Delete"}
          </motion.button>
        </motion.div>
      )}

      <div className="relative z-10 space-y-3">
        {/* Route Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-sky-900">
            {flight.departureAirport?.airportName || flight.departureAirport}
          </h3>
          <span className="text-2xl font-bold text-sky-400">→</span>
          <h3 className="text-lg font-bold text-sky-900">
            {flight.arrivalAirport?.airportName || flight.arrivalAirport}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-sky-200" />

        {/* Flight Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Departure */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">DEPARTURE</p>
            <p className="text-sky-900 font-semibold">
              {new Date(flight.departureDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sky-700 text-xs">
              {new Date(flight.departureDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          {/* Arrival */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">ARRIVAL</p>
            <p className="text-sky-900 font-semibold">
              {new Date(flight.arrivalDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sky-700 text-xs">
              {new Date(flight.arrivalDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-sky-200" />

        {/* Status and Plane Info */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Status */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">STATUS</p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                  flight.status === "ON_TIME"
                    ? "bg-green-200 text-green-900"
                    : flight.status === "PENDING"
                    ? "bg-yellow-200 text-yellow-900"
                    : "bg-red-200 text-red-900"
                }`}
              >
                {flight.status}
              </span>
            </div>
          </div>

          {/* Plane Type */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">AIRCRAFT</p>
            <p className="text-sky-900 font-semibold text-sm">
              {flight.planeType || "N/A"}
            </p>
          </div>
        </div>

        {/* Hover hint */}
        {!isHovering && (
          <div className="text-center mt-4 pt-4 border-t border-sky-200">
            <p className="text-sky-600 text-xs font-semibold opacity-60">
              Hover to edit or delete
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
