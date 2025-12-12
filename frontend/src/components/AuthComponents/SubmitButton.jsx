import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function SubmitButton({
  onClick,
  isLoading = false,
  loadingText = "Signing In...",
  text = "Sign In",
  className = "",
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.01 }}
      whileTap={{ scale: isLoading ? 1 : 0.99 }}
      className={`w-full h-9 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white transition-all duration-200 hover:shadow-lg rounded-md font-medium text-sm flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </motion.button>
  );
}

export default SubmitButton;

