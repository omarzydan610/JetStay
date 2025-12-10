import { useState } from "react";
import { motion } from "framer-motion";
import BookingMonitoringSection from "../../../components/HomePages/Admin/BookingMonitoringSection";
import FlightMonitoringSection from "../../../components/HomePages/Admin/FlightMonitoringSection";
import GlassCard from "../../../components/HomePages/Hotel/GlassCard";

export default function SystemAdminHomePage() {
  const [activeTab, setActiveTab] = useState("bookings");

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
        className="flex-1 flex flex-col max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10 space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-4">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            System Admin Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Monitor bookings and flight transactions across the platform
          </motion.p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "bookings"
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                Hotel Bookings
              </button>
              <button
                onClick={() => setActiveTab("flights")}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === "flights"
                    ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-sky-50"
                }`}
              >
                Flight Transactions
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Content Sections */}
        <motion.div variants={itemVariants}>
          {activeTab === "bookings" ? (
            <BookingMonitoringSection />
          ) : (
            <FlightMonitoringSection />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
