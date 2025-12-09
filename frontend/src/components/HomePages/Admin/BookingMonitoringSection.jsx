import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import GlassCard from "../Hotel/GlassCard";
import adminMonitoringService from "../../../services/AdminServices/adminMonitoringService";

const COLORS = ["#0284c7", "#06b6d4", "#0891b2", "#0e7490"];

// Mock data for testing
const MOCK_DATA = {
  totalBookings: 342,
  totalRevenue: 287650.00,
  bookingsByStatus: {
    CONFIRMED: 185,
    PENDING: 42,
    COMPLETED: 98,
    CANCELLED: 17
  },
  bookingsByPaymentStatus: {
    paid: 312,
    unpaid: 30
  },
  bookingsByHotel: [
    { hotelId: 1, hotelName: "Grand Plaza Hotel", totalBookings: 125, totalRevenue: 105250.00 },
    { hotelId: 2, hotelName: "Seaside Resort", totalBookings: 98, totalRevenue: 82600.00 },
    { hotelId: 3, hotelName: "Mountain View Inn", totalBookings: 119, totalRevenue: 99800.00 }
  ],
  bookingsByPaymentMethod: [
    { methodName: "Credit Card", count: 215, totalAmount: 181225.00 },
    { methodName: "Debit Card", count: 82, totalAmount: 69070.00 },
    { methodName: "PayPal", count: 45, totalAmount: 37925.00 }
  ],
  occupancyMetrics: {
    totalGuests: 756,
    totalRoomsBooked: 412,
    averageGuestsPerBooking: 2.21
  },
  dailyBookings: [
    { date: "2025-01-01", count: 18, revenue: 15150.00 },
    { date: "2025-01-02", count: 25, revenue: 21050.00 },
    { date: "2025-01-03", count: 22, revenue: 18520.00 },
    { date: "2025-01-04", count: 28, revenue: 23580.00 },
    { date: "2025-01-05", count: 35, revenue: 29470.00 },
    { date: "2025-01-06", count: 31, revenue: 26100.00 },
    { date: "2025-01-07", count: 38, revenue: 32010.00 }
  ]
};

// Enhanced Stat Card Component with more details
const EnhancedStatCard = ({ label, value, subValue, icon, trend }) => {
  return (
    <motion.div
      className="flex flex-col p-5 rounded-xl bg-gradient-to-br from-white to-sky-50 border-2 border-sky-200 hover:border-sky-400 hover:shadow-lg transition-all"
      whileHover={{ scale: 1.03, y: -2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-sky-600">{icon}</span>}
      </div>
      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-1">
        {value}
      </span>
      {subValue && (
        <span className="text-xs text-gray-500">{subValue}</span>
      )}
      {trend && (
        <div className={`flex items-center gap-1 text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.positive ? '↑' : '↓'} {trend.text}
        </div>
      )}
    </motion.div>
  );
};

// Color Legend Component
const ColorLegend = ({ data, colors }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {data.map((item, index) => {
        const percentage = data.reduce((sum, d) => sum + d.value, 0) > 0
          ? ((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)
          : 0;

        return (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.value} ({percentage}%)</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function BookingMonitoringSection() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    const fetchHotels = async () => {
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

  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setMonitoringData(MOCK_DATA);
      setError(null);
      setLoading(false);
      toast.success("Mock booking data loaded successfully");
    }, 800);
  };

  const handleFetchData = async () => {
    setError(null);

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
      const data = await adminMonitoringService.getBookingMonitoring(startDate, endDate, selectedHotelId);

      if (!data) {
        setError("No data received from server");
        toast.error("No data received from server");
        setMonitoringData(null);
        return;
      }

      setMonitoringData(data);
      setError(null);
      toast.success("Booking data loaded successfully");
    } catch (err) {
      console.error("Error fetching booking data:", err);

      let errorMessage = "Failed to fetch booking monitoring data";

      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Unauthorized access. Please login again.";
        } else if (err.response.status === 404) {
          errorMessage = "Monitoring endpoint not found. Please contact support.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setMonitoringData(null);
    } finally {
      setLoading(false);
    }
  };

  const bookingStatusData = monitoringData?.bookingsByStatus
    ? Object.entries(monitoringData.bookingsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const paymentStatusData = monitoringData?.bookingsByPaymentStatus
    ? Object.entries(monitoringData.bookingsByPaymentStatus).map(([name, value]) => ({ name, value }))
    : [];

  const paidPercentage = monitoringData
    ? ((monitoringData.bookingsByPaymentStatus?.paid || 0) / (monitoringData.totalBookings || 1) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      {/* Date Range Picker */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Filter Bookings</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Hotel
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(Number(e.target.value))}
                disabled={loadingHotels}
                className="w-full px-4 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
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
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFetchData}
                disabled={loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Get Data"}
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadMockData}
                disabled={loading}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Use Mock Data
              </button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking data...</p>
          </div>
        </motion.div>
      )}

      {/* No Data Message */}
      {!loading && !error && !monitoringData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GlassCard>
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">No data to display</p>
              <p className="text-sm mt-2">Select a date range and click "Get Data" to view booking statistics</p>
              <p className="text-sm mt-1 text-purple-600 font-medium">Or click "Use Mock Data" to test with sample data</p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Summary Statistics */}
      {!loading && monitoringData && (
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnhancedStatCard
              label="Total Bookings"
              value={monitoringData.totalBookings || 0}
              subValue={`${paidPercentage}% paid`}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <EnhancedStatCard
              label="Total Revenue"
              value={`$${monitoringData.totalRevenue?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) || '0.00'}`}
              subValue={`Avg: $${monitoringData.totalBookings ? (monitoringData.totalRevenue / monitoringData.totalBookings).toFixed(2) : '0.00'} per booking`}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <EnhancedStatCard
              label="Total Guests"
              value={monitoringData.occupancyMetrics?.totalGuests || 0}
              subValue={`Avg: ${monitoringData.occupancyMetrics?.averageGuestsPerBooking?.toFixed(2) || '0'} per booking`}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            />
            <EnhancedStatCard
              label="Rooms Booked"
              value={monitoringData.occupancyMetrics?.totalRoomsBooked || 0}
              subValue={`${monitoringData.bookingsByHotel?.length || 0} hotels`}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            />
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      {!loading && monitoringData && (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Status Chart */}
          {bookingStatusData.length > 0 ? (
            <GlassCard>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bookings by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #0284c7",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ColorLegend data={bookingStatusData} colors={COLORS} />
            </GlassCard>
          ) : null}

          {/* Payment Status Chart */}
          {paymentStatusData.length > 0 ? (
            <GlassCard>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #0284c7",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ColorLegend data={paymentStatusData} colors={COLORS} />
            </GlassCard>
          ) : null}
        </motion.div>
      )}

      {/* Bookings by Hotel */}
      {!loading && monitoringData?.bookingsByHotel && monitoringData.bookingsByHotel.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bookings by Hotel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monitoringData.bookingsByHotel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hotelName" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #0284c7",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="totalBookings" fill="#0284c7" name="Total Bookings" />
                <Bar dataKey="totalRevenue" fill="#06b6d4" name="Total Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      )}

      {/* Daily Bookings Trend */}
      {!loading && monitoringData?.dailyBookings && monitoringData.dailyBookings.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Daily Booking Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monitoringData.dailyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #0284c7",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#0284c7" name="Bookings" />
                <Bar dataKey="revenue" fill="#06b6d4" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      )}

      {/* Payment Methods */}
      {!loading && monitoringData?.bookingsByPaymentMethod && monitoringData.bookingsByPaymentMethod.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Bookings by Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {monitoringData.bookingsByPaymentMethod.map((method, index) => {
                const percentage = ((method.count / monitoringData.totalBookings) * 100).toFixed(1);
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-sky-50 to-cyan-50 p-5 rounded-lg border-2 border-sky-200 hover:border-sky-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">{method.methodName}</p>
                      <span className="text-xs bg-sky-600 text-white px-2 py-1 rounded-full">{percentage}%</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                      {method.count}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">${method.totalAmount?.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className="text-xs text-gray-500 mt-1">Avg: ${(method.totalAmount / method.count).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
