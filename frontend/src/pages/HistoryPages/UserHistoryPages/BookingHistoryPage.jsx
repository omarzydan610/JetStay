import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../../services/bookingService";
import BookingSearchFilters from "../../../components/HistoryComponents/UserHistory/BookingSearchFilters";
import BookingCard from "../../../components/HistoryComponents/UserHistory/BookingCard";
import EmptyBookingsState from "../../../components/HistoryComponents/UserHistory/EmptyBookingsState";
import LoadingState from "../../../components/HistoryComponents/UserHistory/LoadingState";
import BookingSummary from "../../../components/HistoryComponents/UserHistory/BookingSummary";

export default function BookingHistoryPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    fetchBookingHistory();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookingHistory = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getBookingHistory();
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) =>
          booking.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id?.toString().includes(query) ||
          booking.room?.hotel?.name?.toLowerCase().includes(query) ||
          booking.room?.roomNumber?.toLowerCase().includes(query) ||
          booking.room?.hotel?.location?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
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
          <h1 className="text-4xl font-bold text-gray-900">Booking History</h1>
          <p className="text-gray-600 mt-2">
            View all your past bookings and reservations
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <BookingSearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </motion.div>

        {/* Bookings List */}
        {loading ? (
          <LoadingState
            itemVariants={itemVariants}
            message="Loading booking history..."
          />
        ) : filteredBookings.length === 0 ? (
          <EmptyBookingsState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            itemVariants={itemVariants}
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                itemVariants={itemVariants}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && filteredBookings.length > 0 && (
          <BookingSummary
            filteredCount={filteredBookings.length}
            totalCount={bookings.length}
            totalSpent={filteredBookings.reduce(
              (sum, booking) => sum + (booking.totalPrice || 0),
              0
            )}
            itemVariants={itemVariants}
          />
        )}
      </motion.div>
    </div>
  );
}
