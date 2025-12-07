import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import airlineStatService from "../../../../services/airlineStats";
import Navbar from "../../../../components/new/Navbar";
import AddFlightSection from "../../../../components/new/HomePages/Airline/FlightsMangment/AddFlightSection";
import EditableFlightList from "../../../../components/new/HomePages/Airline/FlightsMangment/EditableFlightList";
import PrimaryButton from "../../../../components/new/HomePages/Airline/PrimaryButton";
import GlassCard from "../../../../components/new/HomePages/Airline/GlassCard";

function FlightManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(location.state?.tab || "manage");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        await airlineStatService.getAirlineStatistics();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch airline data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <motion.p
            className="text-lg text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading flight management...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center p-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-center max-w-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />
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
        {/* Header with back button */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <motion.h1
              className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Flight Management
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Manage your flight operations
            </motion.p>
          </div>
          <PrimaryButton
            label="← Back"
            onClick={() => navigate("/")}
            variant="secondary"
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <div className="flex gap-4 border-b border-gray-200 pb-4">
              <motion.button
                onClick={() => setActiveTab("manage")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "manage"
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                📋 Manage Flights
              </motion.button>
              <motion.button
                onClick={() => setActiveTab("add")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "add"
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-sky-600"
                }`}
              >
                ➕ Add New Flight
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Content */}
        {activeTab === "manage" && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EditableFlightList />
          </motion.div>
        )}

        {activeTab === "add" && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AddFlightSection />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default FlightManagementPage;
