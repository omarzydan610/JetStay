import React from "react";
import { motion } from "framer-motion";

function DecorativeSidePanel({ icon, title, description, pattern = "grid" }) {
  const patternStyle =
    pattern === "grid"
      ? {
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }
      : {
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        };

  return (
    <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-sky-600 via-cyan-700 to-sky-700 p-6 relative overflow-hidden h-full min-h-[650px]">
      {/* Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={patternStyle}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-24 right-20 w-1.5 h-1.5 bg-cyan-300 rounded-full"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.div
          className="absolute bottom-28 left-16 w-1 h-1 bg-sky-300 rounded-full"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
        <motion.div
          className="absolute top-1/3 left-20 w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="text-center relative z-10 max-w-sm">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg cursor-pointer"
          whileHover={{
            scale: 1.3,
            rotate: 5,
            boxShadow: "0 20px 40px rgba(6, 182, 212, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {icon}
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h2>
        <p className="text-white/80 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default DecorativeSidePanel;

