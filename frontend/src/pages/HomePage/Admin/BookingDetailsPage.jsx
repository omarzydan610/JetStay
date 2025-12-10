import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Hotel, Calendar, DollarSign, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DateRangeFilter from "../../../components/HomePages/Admin/Statistics/DateRangeFilter";
import adminMonitoringService from "../../../services/AdminServices/adminMonitoringService";
import {
  getLastDayStartDate,
  getLastDayEndDate,
} from "../../../utils/dateUtils";

export default function BookingDetailsPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(getLastDayStartDate());
  const [endDate, setEndDate] = useState(getLastDayEndDate());
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchRef = useRef(false);

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

  // Fetch hotels list
  useEffect(() => {
    const fetchHotels = async () => {
      if (fetchRef.current) return;
      fetchRef.current = true;
      setLoadingHotels(true);
      try {
        const hotelsData = await adminMonitoringService.getAllHotels();
        setHotels(hotelsData || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        toast.error("Failed to load hotels list");
      } finally {
        setLoadingHotels(false);
      }
    };

    fetchHotels();
  }, []);

  // Auto-load data for the last day when component mounts
  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter bookings based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bookings.filter((booking) => {
      return (
        booking.id?.toString().includes(query) ||
        booking.user?.name?.toLowerCase().includes(query) ||
        booking.user?.email?.toLowerCase().includes(query) ||
        booking.room?.hotel?.name?.toLowerCase().includes(query) ||
        booking.room?.roomNumber?.toLowerCase().includes(query) ||
        booking.status?.toLowerCase().includes(query)
      );
    });
    setFilteredBookings(filtered);
  }, [searchQuery, bookings]);

  const handleDateRangeChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleFetchData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date must be before end date");
      return;
    }

    setLoading(true);
    try {
      const data = await adminMonitoringService.getBookingDetails(
        startDate,
        endDate,
        selectedHotelId
      );

      setBookings(data || []);
      setFilteredBookings(data || []);
      toast.success(`Loaded ${data?.length || 0} bookings`);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      let errorMessage = "Failed to fetch bookings data";

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Unauthorized access. Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast.error(errorMessage);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
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

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "N/A";
    return `$${Number(price).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower === "confirmed") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Confirmed
        </span>
      );
    } else if (statusLower === "pending") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    } else if (statusLower === "cancelled") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Cancelled
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const getPaymentStatusBadge = (isPaid) => {
    if (isPaid) {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10"
      >
        {/* Header with back button */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Hotel Booking Details
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Detailed information about all hotel bookings
          </motion.p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="mb-6 bg-white rounded-xl shadow-lg border border-sky-100 p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Hotel
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(Number(e.target.value))}
                disabled={loadingHotels}
                className="w-full px-4 py-2.5 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value={0}>All Hotels</option>
                {hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <DateRangeFilter
                onDateRangeChange={handleDateRangeChange}
                initialRange={{ startDate, endDate }}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchData}
                disabled={loading || !startDate || !endDate}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Get Bookings"}
              </button>
            </div>
          </div>

          {/* Search */}
          {bookings.length > 0 && (
            <div className="mt-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by booking ID, guest name, email, hotel, room number, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings data...</p>
            </div>
          </motion.div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredBookings.length} Booking{filteredBookings.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-sky-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Booking Info */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Hotel size={16} />
                        <span>Booking {booking.bookingTransactionId}</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {booking.hotel?.hotelName || "Unknown Hotel"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Number of Rooms: {booking?.numberOfRooms || "N/A"}
                      </div>
                    </div>

                    {/* Guest Info */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <User size={16} />
                        <span>Guest</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {booking.user?.firstName +" "+ booking.user?.lastName  || "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.user?.email || "N/A"}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Users size={14} />
                        <span>{booking.numberOfGuests || 0} guest{booking.numberOfGuests !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span>Stay Dates</span>
                      </div>
                      <div className="text-sm text-gray-900">
                        <div>Check-in: {formatDate(booking.checkIn)}</div>
                        <div>Check-out: {formatDate(booking.checkOut)}</div>
                        <div className="text-gray-600 mt-1">
                          Booked: {formatDate(booking.bookingDate)}
                        </div>
                      </div>
                    </div>

                    {/* Payment & Status */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <DollarSign size={16} />
                        <span>Payment</span>
                      </div>
                      <div className="font-semibold text-gray-900 mb-2">
                        {formatPrice(booking.totalPrice)}
                      </div>
                      <div className="space-y-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-sky-100"
          >
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h2>
            <p className="text-gray-600 text-center max-w-md">
              Select a date range and click "Get Bookings" to view hotel booking details.
            </p>
          </motion.div>
        )}

        {/* No Results State */}
        {!loading && bookings.length > 0 && filteredBookings.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-sky-100"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 text-center max-w-md">
              No bookings match your search criteria. Try adjusting your search query.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
