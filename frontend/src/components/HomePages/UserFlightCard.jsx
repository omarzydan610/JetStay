import { motion } from "framer-motion";

export default function UserFlightCard({ flight, onClick }) {
  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "-";
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      onClick={onClick}
      className="group relative bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500 rounded-xl p-4 md:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer w-full"
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300" />

      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/80 font-medium">AIRLINE</div>
            <div className="text-lg md:text-xl font-bold text-white leading-tight">
              {flight.airline?.airlineName || "N/A"}
            </div>
            <div className="text-xs text-white/80">{flight.airline?.airlineNationality || "-"}</div>
          </div>
          <div className="text-sm text-white/90 font-semibold">{flight.planeType || "N/A"}</div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {flight.departureAirport?.airportName || flight.departureAirport || "-"}
            </div>
            <div className="text-xs text-white/80 truncate">
              {flight.departureAirport?.city || "-"}, {flight.departureAirport?.country || "-"}
            </div>
          </div>

          <div className="mx-3 text-2xl text-white/90 font-bold">→</div>

          <div className="flex-1 text-right min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {flight.arrivalAirport?.airportName || flight.arrivalAirport || "-"}
            </div>
            <div className="text-xs text-white/80 truncate">
              {flight.arrivalAirport?.city || "-"}, {flight.arrivalAirport?.country || "-"}
            </div>
          </div>
        </div>

        <div className="h-px bg-white/20 my-2" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-white/90 text-sm">
          <div>
            <div className="text-xs text-white/70 font-medium">DEPARTS</div>
            <div className="font-semibold">{formatDate(flight.departureDate)}</div>
            <div className="text-xs">{formatTime(flight.departureDate)}</div>
          </div>

          <div>
            <div className="text-xs text-white/70 font-medium">ARRIVES</div>
            <div className="font-semibold">{formatDate(flight.arrivalDate)}</div>
            <div className="text-xs">{formatTime(flight.arrivalDate)}</div>
          </div>

          <div>
            <div className="text-xs text-white/70 font-medium">TRIP TYPES</div>
            {((flight.tripsTypes || flight.tripTypes) || []).length === 0 ? (
              <div className="text-xs">-</div>
            ) : (
              <div className="flex flex-col gap-1">
                {((flight.tripsTypes || flight.tripTypes) || []).slice(0, 3).map((t, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-medium">{t.typeName || t.name}</span>:{" "}
                    <span>${t.price?.toFixed ? t.price.toFixed(2) : t.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}