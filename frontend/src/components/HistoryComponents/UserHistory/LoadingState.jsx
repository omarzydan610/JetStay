import { motion } from "framer-motion";

const LoadingState = ({ itemVariants, message = "Loading..." }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-12 text-center"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </motion.div>
  );
};

export default LoadingState;
