import { motion } from "framer-motion";
import {
  Hotel,
  Plane,
  MapPin,
  Calendar,
  Users,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge";

const BookingCard = ({ booking, itemVariants }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Section - Booking Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {booking.type === "HOTEL" ? (
                  <>
                    <Hotel size={20} className="text-sky-600" />
                    {booking.room?.hotel?.name}
                  </>
                ) : (
                  <>
                    <Plane size={20} className="text-cyan-600" />
                    {booking.ticket?.flight?.airline?.name}
                  </>
                )}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <MapPin size={14} />
                {booking.type === "HOTEL"
                  ? booking.room?.hotel?.location
                  : `${booking.ticket?.flight?.from} → ${booking.ticket?.flight?.to}`}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Booking ID</p>
              <p className="font-medium text-gray-900">
                #{booking.compositeId || booking.id}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {booking.type === "HOTEL" ? "Room Type" : "Class"}
              </p>
              <p className="font-medium text-gray-900">
                {booking.type === "HOTEL"
                  ? booking.room?.type
                  : booking.ticket?.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {booking.type === "HOTEL" ? "Check-in" : "Departure"}
              </p>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(booking.checkInDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">
                {booking.type === "HOTEL" ? "Check-out" : "Arrival"}
              </p>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(booking.checkOutDate)}
              </p>
            </div>
          </div>

          {booking.type === "HOTEL" && (
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {booking.numberOfGuests} Guest(s)
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {calculateNights(
                  booking.checkInDate,
                  booking.checkOutDate
                )}{" "}
                Night(s)
              </span>
            </div>
          )}
        </div>

        {/* Right Section - Price */}
        <div className="flex flex-col items-end justify-center">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Total Price</p>
            <p className="text-2xl font-bold text-sky-600 flex items-center gap-1">
              <DollarSign size={20} />
              {booking.totalPrice?.toFixed(2) || "0.00"}
            </p>
          </div>
          <button
            onClick={() =>
              navigate(`/bookings/${booking.id}`, {
                state: { type: booking.type },
              })
            }
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;
