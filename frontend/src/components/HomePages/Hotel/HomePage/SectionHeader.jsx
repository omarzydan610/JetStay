import { motion } from "framer-motion";

export default function SectionHeader({ title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </motion.div>
  );
}
