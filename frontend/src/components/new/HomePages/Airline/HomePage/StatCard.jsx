import { motion } from "framer-motion";

export default function StatCard({ label, value }) {
  return (
    <motion.div
      className="flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 hover:border-sky-400 transition-colors"
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-sm font-medium text-gray-600 mb-1 capitalize truncate">
        {label}
      </span>
      <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
        {value}
      </span>
    </motion.div>
  );
}
