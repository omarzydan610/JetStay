import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import airlineStatService from "../../../../services/airlineStats.js";
import StatsSection from "./StatsSection";
import FlightStatusChart from "./FlightStatusChart";
import SectionHeader from "./SectionHeader";

export default function StatisticsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Now getAirlineStatistics includes flight status data
        const combinedStats = await airlineStatService.getAirlineStatistics();
        setStats(combinedStats);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch airline data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.p
          className="text-gray-500 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading statistics...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center">
        {error}
      </div>
    );
  }

  // Extract flight status for the chart
  const flightStatusData = stats
    ? [
        { name: "Pending", value: stats.pendingCount || 0 },
        { name: "On Time", value: stats.onTimeCount || 0 },
        { name: "Cancelled", value: stats.cancelledCount || 0 },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Airline Statistics"
        description="View your airline performance metrics"
      />

      {/* Stats Grid */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatsSection airlineStats={stats} />
        </motion.div>
      )}

      {/* Flight Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FlightStatusChart flightData={flightStatusData} />
      </motion.div>
    </motion.div>
  );
}
