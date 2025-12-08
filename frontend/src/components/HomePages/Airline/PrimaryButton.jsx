import { motion } from "framer-motion";

export default function PrimaryButton({
  onClick,
  children,
  loading = false,
  icon = null,
  disabled = false,
  label = null,
  variant = "primary",
  type = "button",
}) {
  const baseClass =
    "px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white",
    secondary: "bg-white border-2 border-sky-600 text-sky-600 hover:bg-sky-50",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variants[variant]}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {loading ? "Loading..." : label || children}
    </motion.button>
  );
}
