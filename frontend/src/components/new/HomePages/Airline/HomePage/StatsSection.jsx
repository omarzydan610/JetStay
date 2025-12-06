import { motion } from "framer-motion";
import StatCard from "./StatCard";

export default function StatsSection({ airlineStats }) {
  if (!airlineStats) return null;

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
      className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
    >
      {Object.entries(airlineStats).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <StatCard label={key} value={value} />
        </motion.div>
      ))}
    </motion.div>
  );
}
