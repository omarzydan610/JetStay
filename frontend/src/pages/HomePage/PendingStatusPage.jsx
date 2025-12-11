import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Navbar from "../../components/Navbar";

function PendingStatusPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50">
      <Navbar />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)]"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center text-center max-w-2xl px-4"
        >
          {/* Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-400 flex items-center justify-center shadow-2xl">
              <Clock className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4"
          >
            Pending Approval
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            Your account has been submitted for approval. Our system administrators are reviewing your information.
          </motion.p>

          {/* Info Box */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-8 mb-8 max-w-lg w-full"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              What's happening?
            </h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-200 text-yellow-700 text-sm font-bold mr-3 flex-shrink-0">
                  ✓
                </span>
                <span>Your registration has been received</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-200 text-yellow-700 text-sm font-bold mr-3 flex-shrink-0">
                  ⏳
                </span>
                <span>Waiting for system administrator review</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-200 text-yellow-700 text-sm font-bold mr-3 flex-shrink-0">
                  📧
                </span>
                <span>You'll receive an email once approved</span>
              </li>
            </ul>
          </motion.div>

          {/* Timing Info */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 text-sm mb-8"
          >
            Approval typically takes 24-48 hours. We appreciate your patience!
          </motion.p>

          {/* Decorative element */}
          <motion.div
            variants={itemVariants}
            className="flex gap-2 justify-center"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-yellow-400"
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PendingStatusPage;
