import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Plane, Calendar, DollarSign, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DateRangeFilter from "../../../components/HomePages/Admin/Statistics/DateRangeFilter";
import adminMonitoringService from "../../../services/AdminServices/adminMonitoringService";
import {
  getLastDayStartDate,
  getLastDayEndDate,
} from "../../../utils/dateUtils";

export default function TicketsDetailsPage() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(getLastDayStartDate());
  const [endDate, setEndDate] = useState(getLastDayEndDate());
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedAirlineId, setSelectedAirlineId] = useState(0);
  const [airlines, setAirlines] = useState([]);
  const [loadingAirlines, setLoadingAirlines] = useState(false);
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

  // Fetch airlines list
  useEffect(() => {
    const fetchAirlines = async () => {
      if (fetchRef.current) return;
      fetchRef.current = true;
      setLoadingAirlines(true);
      try {
        const airlinesData = await adminMonitoringService.getAllAirlines();
        setAirlines(airlinesData || []);
      } catch (err) {
        console.error("Error fetching airlines:", err);
        toast.error("Failed to load airlines list");
      } finally {
        setLoadingAirlines(false);
      }
    };

    fetchAirlines();
  }, []);

  // Auto-load data for the last day when component mounts
  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter tickets based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter((ticket) => {
      return (
        ticket.ticketId?.toString().includes(query) ||
        ticket.passengerName?.toLowerCase().includes(query) ||
        ticket.passengerEmail?.toLowerCase().includes(query) ||
        ticket.flight?.flightNumber?.toLowerCase().includes(query) ||
        ticket.flight?.airline?.name?.toLowerCase().includes(query) ||
        ticket.seatNumber?.toLowerCase().includes(query)
      );
    });
    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

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
      const data = await adminMonitoringService.getTicketsDetails(
        startDate,
        endDate,
        selectedAirlineId
      );

      setTickets(data || []);
      setFilteredTickets(data || []);
      toast.success(`Loaded ${data?.length || 0} tickets`);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      let errorMessage = "Failed to fetch tickets data";

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Unauthorized access. Please login again.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast.error(errorMessage);
      setTickets([]);
      setFilteredTickets([]);
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
          className="absolute top-0 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
            Flight Tickets Details
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Detailed information about all flight tickets
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
                Select Airline
              </label>
              <select
                value={selectedAirlineId}
                onChange={(e) => setSelectedAirlineId(Number(e.target.value))}
                disabled={loadingAirlines}
                className="w-full px-4 py-2.5 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value={0}>All Airlines</option>
                {airlines.map((airline) => (
                  <option key={airline?.id} value={airline?.id}>
                    {airline?.name}
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
                {loading ? "Loading..." : "Get Tickets"}
              </button>
            </div>
          </div>

          {/* Search */}
          {tickets.length > 0 && (
            <div className="mt-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by ticket ID, passenger name, email, flight number, airline..."
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
              <p className="text-gray-600">Loading tickets data...</p>
            </div>
          </motion.div>
        )}

        {/* Tickets List */}
        {!loading && filteredTickets.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {filteredTickets.length} Ticket{filteredTickets.length !== 1 ? "s" : ""} Found
              </h2>
            </div>

            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.ticketId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg border border-sky-100 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Ticket Info */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Plane size={16} />
                        <span>Ticket {ticket.ticketId}</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {ticket.flight?.airline?.airlineName || "Unknown Airline"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Flight: {ticket.flight?.flightID || "N/A"}
                      </div>
                    </div>

                    {/* Passenger Info */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <User size={16} />
                        <span>Passenger</span>
                      </div>
                      <div className="font-semibold text-gray-900">
                        {ticket?.user?.firstName+ ticket?.user?.lastName|| "N/A"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {ticket?.user?.email || "N/A"}
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar size={16} />
                        <span>Flight Details</span>
                      </div>
                      <div className="text-sm text-gray-900">
                        <div>From: {ticket.flight?.departureAirport?.airportName || "N/A"}</div>
                        <div>To: {ticket.flight?.arrivalAirport?.airportName || "N/A"}</div>
                        <div className="text-gray-600">
                          {formatDate(ticket.flight?.departureDate)}
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <DollarSign size={16} />
                        <span>Payment</span>
                      </div>
                      <div className="font-semibold text-gray-900 mb-2">
                        {formatPrice(ticket?.price)}
                      </div>
                      {getPaymentStatusBadge(ticket.paid)}
                      <div className="text-xs text-gray-500 mt-2">
                        Booked: {formatDate(ticket.createdAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && tickets.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-purple-100"
          >
            <div className="text-6xl mb-4">🎫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tickets Found</h2>
            <p className="text-gray-600 text-center max-w-md">
              Select a date range and click "Get Tickets" to view flight ticket details.
            </p>
          </motion.div>
        )}

        {/* No Results State */}
        {!loading && tickets.length > 0 && filteredTickets.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-purple-100"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
            <p className="text-gray-600 text-center max-w-md">
              No tickets match your search criteria. Try adjusting your search query.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
