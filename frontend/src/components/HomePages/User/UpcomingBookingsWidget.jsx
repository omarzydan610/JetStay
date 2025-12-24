import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Hotel,
  MapPin,
  ChevronRight,
  X,
  Plane,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../../services/bookingService";

export default function UpcomingBookingsWidget() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getUpcomingBookings();
      // Sort by check-in date (earliest first) and get only the first 3 upcoming bookings
      const sorted = (response.data || []).sort(
        (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)
      );
      setBookings(sorted.slice(0, 3));
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateDaysUntil = (checkInDate) => {
    if (!checkInDate) return 0;
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const days = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getCountdownText = (daysUntil) => {
    if (daysUntil === 0) return "Today";
    if (daysUntil === 1) return "Tomorrow";
    return `${daysUntil} days`;
  };

  const getCountdownColor = (daysUntil) => {
    if (daysUntil === 0) return "text-red-600 bg-red-50";
    if (daysUntil === 1) return "text-orange-600 bg-orange-50";
    if (daysUntil <= 7) return "text-yellow-600 bg-yellow-50";
    return "text-blue-600 bg-blue-50";
  };

  if (loading) {
    return (
      <div className="w-full py-4 px-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4">
          <div className="animate-pulse flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return null; // Don't show widget if no upcoming bookings
  }

  return (
    <div className="w-full bg-gradient-to-br from-sky-50 via-white to-cyan-50 py-4 px-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Calendar size={20} />
            <h3 className="font-semibold">Upcoming Bookings</h3>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {bookings.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              {isExpanded ? <X size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-sm"
            >
              <div className="divide-y divide-gray-100">
                {bookings.map((booking) => {
                  const daysUntil = calculateDaysUntil(booking.checkInDate);
                  return (
                    <div
                      key={booking.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/bookings/${booking.id}`)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-center gap-4 flex-1">
                          {/* Countdown Badge */}
                          <div
                            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg ${getCountdownColor(
                              daysUntil
                            )} min-w-[80px]`}
                          >
                            <span className="text-xs font-medium opacity-75">
                              {daysUntil === 0 ? "Check-in" : "In"}
                            </span>
                            <span className="text-lg font-bold">
                              {getCountdownText(daysUntil)}
                            </span>
                          </div>

                          {/* Hotel Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate flex items-center gap-2">
                              {booking.type === "HOTEL" ? (
                                <>
                                  <Hotel
                                    size={16}
                                    className="text-sky-600 flex-shrink-0"
                                  />
                                  {booking.room?.hotel?.name}
                                </>
                              ) : (
                                <>
                                  <Plane
                                    size={16}
                                    className="text-cyan-600 flex-shrink-0"
                                  />
                                  {booking.ticket?.flight?.airline?.name}
                                </>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 truncate flex items-center gap-1 mt-0.5">
                              <MapPin size={12} />
                              {booking.type === "HOTEL"
                                ? booking.room?.hotel?.location
                                : `${booking.ticket?.flight?.from} → ${booking.ticket?.flight?.to}`}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {formatDate(booking.checkInDate)}
                                {booking.type === "HOTEL" &&
                                  ` - ${formatDate(booking.checkOutDate)}`}
                              </span>
                              {booking.type === "HOTEL" && (
                                <span>{booking.room?.type}</span>
                              )}
                              {booking.type === "FLIGHT" && (
                                <span>{booking.ticket?.type}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Section - View Details */}
                        <div className="flex items-center gap-2">
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer - View All Link */}
              {bookings.length >= 3 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/bookings/upcoming");
                    }}
                    className="w-full text-center text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    View all upcoming bookings →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
