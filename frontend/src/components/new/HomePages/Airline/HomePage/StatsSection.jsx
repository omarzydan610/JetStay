import { motion } from "framer-motion";
import StatCard from "./StatCard";

export default function StatsSection({ airlineStats }) {
  if (!airlineStats) return null;

  // Only show these three metrics
  const statsToDisplay = [
    { label: "Total Flights", value: airlineStats.totalFlights },
    {
      label: "Total Revenue",
      value: `$${(airlineStats.totalRevenue || 0).toLocaleString()}`,
    },
    { label: "Avg Rating", value: (airlineStats.avgRating || 0).toFixed(1) },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
    >
      {statsToDisplay.map(({ label, value }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <StatCard label={label} value={value} />
        </motion.div>
      ))}
    </motion.div>
  );
}
