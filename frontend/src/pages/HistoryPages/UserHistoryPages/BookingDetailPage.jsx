import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Hotel,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  User,
  Bed,
  Plane,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import bookingService from "../../../services/bookingService";

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      navigate("/bookings/history");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await bookingService.cancelBooking(bookingId);
      navigate("/bookings/history");
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
      COMPLETED: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: CheckCircle,
      },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
    };

    const config = statusConfig[status?.toUpperCase()] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={18} />
        {status}
      </span>
    );
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking not found
          </h2>
          <button
            onClick={() => navigate("/bookings/history")}
            className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="text-lg">Back</span>
            </button>
            {getStatusBadge(booking.status)}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Booking Details
          </h1>
          <p className="text-gray-600">
            Booking ID:{" "}
            <span className="font-mono font-semibold">#{booking.id}</span>
          </p>
        </motion.div>

        {/* Hotel Information */}
        {booking.type === "HOTEL" && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Hotel className="text-sky-600" size={24} />
              Hotel Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Hotel Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.hotel?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin size={14} />
                  Location
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.hotel?.location || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Phone size={14} />
                  Contact
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.hotel?.phoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Mail size={14} />
                  Email
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.hotel?.email || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Room Details (for hotels) */}
        {booking.type === "HOTEL" && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bed className="text-sky-600" size={24} />
              Room Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.roomNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Room Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Capacity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.room?.capacity || "N/A"} Guests
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price per Night</p>
                <p className="text-lg font-semibold text-indigo-600 flex items-center gap-1">
                  <DollarSign size={18} />
                  {booking.room?.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Flight Information */}
        {booking.type === "FLIGHT" && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plane className="text-sky-600" size={24} />
              Flight Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Airline</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.flight?.airline?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Flight Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.flight?.flightNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">From</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.flight?.departureAirport || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">To</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.flight?.arrivalAirport || "N/A"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ticket Details (for flights) */}
        {booking.type === "FLIGHT" && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-sky-600" size={24} />
              Ticket Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Seat Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.seatNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Class</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Baggage Allowance</p>
                <p className="text-lg font-semibold text-gray-900">
                  {booking.ticket?.baggageAllowance || "N/A"} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ticket Price</p>
                <p className="text-lg font-semibold text-indigo-600 flex items-center gap-1">
                  <DollarSign size={18} />
                  {booking.ticket?.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Booking Details */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-sky-600" size={24} />
            Booking Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {booking.type === "HOTEL" ? "Check-in Date" : "Departure Date"}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(booking.checkInDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {booking.type === "HOTEL" ? "Check-out Date" : "Arrival Date"}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(booking.checkOutDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <Users size={14} />
                Adults
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.adults || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                <Users size={14} />
                Children
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.children || 0}
              </p>
            </div>
            {booking.type === "HOTEL" && (
              <div>
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Clock size={14} />
                  Number of Nights
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {calculateNights(booking.checkInDate, booking.checkOutDate)}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Booking Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDateTime(booking.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Summary */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white mb-6"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign size={24} />
            Payment Summary
          </h2>
          <div className="space-y-4">
            {booking.type === "HOTEL" && (
              <>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-lg">Room Rate per Night</span>
                  <span className="text-lg font-semibold">
                    ${booking.room?.price?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-lg">Number of Nights</span>
                  <span className="text-lg font-semibold">
                    {calculateNights(booking.checkInDate, booking.checkOutDate)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-2xl font-bold">Total Amount</span>
              <span className="text-3xl font-bold">
                ${booking.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        {booking.status === "CONFIRMED" && (
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-end"
          >
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              onClick={handleCancelBooking}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            >
              <XCircle size={20} />
              Cancel Booking
            </button>
          </motion.div>
        )}

        {booking.status !== "CONFIRMED" && (
          <motion.div variants={itemVariants} className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default BookingDetailPage;
