import { motion } from "framer-motion";
import { Hotel } from "lucide-react";

const EmptyBookingsState = ({ searchQuery, statusFilter, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-12 text-center"
    >
      <Hotel size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No bookings found
      </h3>
      <p className="text-gray-600">
        {searchQuery || statusFilter !== "all"
          ? "Try adjusting your filters"
          : "You haven't made any bookings yet"}
      </p>
    </motion.div>
  );
};

export default EmptyBookingsState;
