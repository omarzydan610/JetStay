import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatisticsSection from "../../../components/HomePages/Hotel/HomePage/StatisticsSection.jsx";
import RoomListSection from "../../../components/HomePages/Hotel/HomePage/RoomListSection.jsx";
import HotelReviewsList from "../../../components/HomePages/User/HotelReview/HotelReviewsList.jsx";
import authService from "../../../services/AuthServices/authService.js";

function HotelHomePage() {
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const clamis = authService.parseJwt();

  useEffect(() => {
    setLoading(false);
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
      <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 flex items-center justify-center">
        <motion.p
          className="text-lg text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading hotel dashboard...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 text-center max-w-md">
          {error}
        </div>
      </div>
    );
  }

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
            Hotel Dashboard
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Manage your rooms and view real-time statistics
          </motion.p>
        </motion.div>

        {/* Statistics Section */}
        <motion.div variants={itemVariants}>
          <StatisticsSection />
        </motion.div>

        {/* Room List Section */}
        <motion.div variants={itemVariants}>
          <RoomListSection />
        </motion.div>

        {/* Reviews List Section */}
        <motion.div variants={itemVariants}>
          <HotelReviewsList hotelId={clamis.hotel_id} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HotelHomePage;
