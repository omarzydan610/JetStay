import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import GlassCard from "../../components/HomePages/Hotel/GlassCard";
import StatCard from "../../components/HomePages/Hotel/StatCard";
import adminMonitoringService from "../../services/AdminServices/adminMonitoringService";

const COLORS = ["#0284c7", "#06b6d4", "#0891b2", "#0e7490"];

export default function BookingMonitoringPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState(null);

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
      transition: { duration: 0.5 },
    },
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
      const data = await adminMonitoringService.getBookingMonitoring(startDate, endDate);
      setMonitoringData(data);
      toast.success("Booking data loaded successfully");
    } catch (error) {
      toast.error("Failed to fetch booking monitoring data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const bookingStatusData = monitoringData?.bookingsByStatus
    ? Object.entries(monitoringData.bookingsByStatus).map(([name, value]) => ({ name, value }))
    : [];

  const paymentStatusData = monitoringData?.bookingsByPaymentStatus
    ? Object.entries(monitoringData.bookingsByPaymentStatus).map(([name, value]) => ({ name, value }))
    : [];

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
        className="flex-1 flex flex-col max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10 space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Hotel Booking Monitoring
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Monitor booking transactions and revenue within a date range
          </motion.p>
        </motion.div>

        {/* Date Range Picker */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Select Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          </GlassCard>
        </motion.div>

        {/* Summary Statistics */}
        {monitoringData && (
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Total Bookings" value={monitoringData.totalBookings || 0} />
              <StatCard label="Total Revenue" value={`$${monitoringData.totalRevenue?.toFixed(2) || 0}`} />
              <StatCard label="Total Guests" value={monitoringData.occupancyMetrics?.totalGuests || 0} />
              <StatCard label="Rooms Booked" value={monitoringData.occupancyMetrics?.totalRoomsBooked || 0} />
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        {monitoringData && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Status Chart */}
            {bookingStatusData.length > 0 && (
              <GlassCard>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Bookings by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
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
              </GlassCard>
            )}

            {/* Payment Status Chart */}
            {paymentStatusData.length > 0 && (
              <GlassCard>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
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
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Bookings by Hotel */}
        {monitoringData?.bookingsByHotel && monitoringData.bookingsByHotel.length > 0 && (
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
        {monitoringData?.dailyBookings && monitoringData.dailyBookings.length > 0 && (
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
        {monitoringData?.bookingsByPaymentMethod && monitoringData.bookingsByPaymentMethod.length > 0 && (
          <motion.div variants={itemVariants}>
            <GlassCard>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bookings by Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {monitoringData.bookingsByPaymentMethod.map((method, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-sky-50 to-cyan-50 p-4 rounded-lg border border-sky-200"
                  >
                    <p className="text-sm font-medium text-gray-600">{method.methodName}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                      {method.count}
                    </p>
                    <p className="text-sm text-gray-500">${method.totalAmount?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
