import { motion } from "framer-motion";

const BookingSummary = ({ filteredCount, totalCount, totalSpent, itemVariants }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-6 bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredCount} of {totalCount} booking(s)
        </span>
        <span>Total Spent: $ {totalSpent.toFixed(2)}</span>
      </div>
    </motion.div>
  );
};

export default BookingSummary;
