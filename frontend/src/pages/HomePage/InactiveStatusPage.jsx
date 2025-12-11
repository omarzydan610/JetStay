import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";

function InactiveStatusPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      <Navbar />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center shadow-2xl">
              <AlertCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4"
          >
            Account Inactive
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 mb-6 leading-relaxed"
          >
            Your account has been deactivated and is currently inactive.
          </motion.p>

          {/* Info Box */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-8 mb-8 max-w-lg w-full"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Why is my account inactive?
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been marked as inactive by a system
              administrator. This may be due to:
            </p>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 text-sm font-bold mr-3 flex-shrink-0">
                  •
                </span>
                <span>Policy violations or reported issues</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 text-sm font-bold mr-3 flex-shrink-0">
                  •
                </span>
                <span>Administrative suspension</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-700 text-sm font-bold mr-3 flex-shrink-0">
                  •
                </span>
                <span>Account security concerns</span>
              </li>
            </ul>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 mb-8 max-w-lg w-full"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              Please contact our support team to discuss your account status and
              explore options for reactivation.
            </p>
            <a
              href="mailto:jetstay.help@gmail.com"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Contact Support
            </a>
          </motion.div>

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
                className="w-3 h-3 rounded-full bg-red-400"
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default InactiveStatusPage;
