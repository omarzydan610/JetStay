import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TicketsDetailsPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10"
      >
        {/* Header with back button */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </motion.div>

        {/* Title */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.h1
            className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Tickets Details
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Detailed information about all flight tickets
          </motion.p>
        </motion.div>

        {/* Empty state */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg border border-purple-100"
        >
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600 text-center max-w-md">
            The tickets details page is currently under development. Check back
            soon for detailed ticket information and flight analytics.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
