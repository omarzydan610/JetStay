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
  AlertCircle,
  Search,
  X,
  Plane,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../../services/bookingHistoryService";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function UpcomingBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date' or 'price'
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [canceling, setCanceling] = useState(false);

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
    fetchUpcomingBookings();
  }, []);

  const fetchUpcomingBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getUpcomingBookings();
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingBookings();
  }, []);

  useEffect(() => {
    const filterAndSortBookings = () => {
      let filtered = [...bookings];

      // Apply search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (booking) =>
            booking.id?.toString().includes(query) ||
            booking.room?.hotel?.name?.toLowerCase().includes(query) ||
            booking.room?.hotel?.location?.toLowerCase().includes(query) ||
            booking.ticket?.flight?.airline?.name?.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (sortBy === "date") {
        filtered.sort(
          (a, b) => new Date(a.checkInDate) - new Date(b.checkInDate)
        );
      } else if (sortBy === "price") {
        filtered.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));
      }

      setFilteredBookings(filtered);
    };

    filterAndSortBookings();
  }, [searchQuery, sortBy, bookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setCanceling(true);
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      setShowCancelModal(false);
      setSelectedBooking(null);
      // Refresh the bookings list
      fetchUpcomingBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setCanceling(false);
    }
  };

  const openCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: CheckCircle,
      },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
    };

    const config = statusConfig[status?.toUpperCase()] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={14} />
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

  const calculateDaysUntil = (checkInDate) => {
    if (!checkInDate) return 0;
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const days = Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getCountdownBadge = (daysUntil) => {
    if (daysUntil === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle size={14} />
          Today
        </span>
      );
    } else if (daysUntil === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <AlertCircle size={14} />
          Tomorrow
        </span>
      );
    } else if (daysUntil <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={14} />
          In {daysUntil} days
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock size={14} />
          In {daysUntil} days
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Upcoming Bookings
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage your upcoming reservations
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="mb-6 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by hotel name, booking ID, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </motion.div>

        {/* Bookings List */}
        {loading ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading upcoming bookings...</p>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-12 text-center"
          >
            <Hotel size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No upcoming bookings
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search"
                : "You don't have any upcoming bookings"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => {
              const daysUntil = calculateDaysUntil(booking.checkInDate);
              return (
                <motion.div
                  key={booking.id}
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
                              ? booking.room?.hotel?.location || "N/A"
                              : `${booking.ticket?.flight?.from || "N/A"} → ${
                                  booking.ticket?.flight?.to || "N/A"
                                }`}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {getStatusBadge(booking.status)}
                          {getCountdownBadge(daysUntil)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Booking ID
                          </p>
                          <p className="font-medium text-gray-900">
                            #{booking.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {booking.type === "HOTEL" ? "Room" : "Seat"}
                          </p>
                          <p className="font-medium text-gray-900">
                            {booking.type === "HOTEL"
                              ? booking.room?.type
                              : booking.ticket?.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {booking.type === "HOTEL"
                              ? "Check-in"
                              : "Departure"}
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

                    {/* Right Section - Price & Actions */}
                    <div className="flex flex-col items-end justify-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">
                          Total Price
                        </p>
                        <p className="text-2xl font-bold text-sky-600 flex items-center gap-1">
                          <DollarSign size={20} />
                          {booking.totalPrice?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/bookings/${booking.id}`)}
                          className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openCancelModal(booking)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {!loading && filteredBookings.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-6 bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredBookings.length} of {bookings.length}{" "}
                booking(s)
              </span>
              <span>
                Total Value: ${" "}
                {filteredBookings
                  .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <ConfirmationModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleCancelBooking}
          title="Cancel Booking"
          message={`Are you sure you want to cancel your booking at ${selectedBooking?.room?.hotel?.name}? This action cannot be undone.`}
          confirmText="Yes, Cancel Booking"
          cancelText="Keep Booking"
          isLoading={canceling}
        />
      )}
    </div>
  );
}
