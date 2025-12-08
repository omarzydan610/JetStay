import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ boxShadow: "0 25px 50px -12px rgba(8, 145, 178, 0.15)" }}
    >
      {children}
    </motion.div>
  );
}
