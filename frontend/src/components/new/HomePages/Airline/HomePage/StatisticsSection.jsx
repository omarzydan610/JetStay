import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import airlineStatService from "../../../../../services/airlineStats.js";
import StatsSection from "./StatsSection";
import FlightStatusChart from "./FlightStatusChart";
import SectionHeader from "./SectionHeader";

export default function StatisticsSection() {
  const [airlineStats, setAirlineStats] = useState(null);
  const [flightStatus, setFlightStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const stats = await airlineStatService.getAirlineStats();
        setAirlineStats(stats);

        const flights = await airlineStatService.getFlightStatus();
        setFlightStatus(flights);
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

  const flightData = flightStatus
    ? Object.entries(flightStatus).map(([key, value]) => ({ name: key, value }))
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
      {airlineStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatsSection airlineStats={airlineStats} />
        </motion.div>
      )}

      {/* Flight Status Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FlightStatusChart flightData={flightData} />
      </motion.div>
    </motion.div>
  );
}
