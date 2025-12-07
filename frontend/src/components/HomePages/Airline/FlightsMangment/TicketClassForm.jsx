import { motion } from "framer-motion";
import FormField from "./FormField";

export default function TicketClassForm({ tickets, errors, onChange }) {
  const classes = [
    { label: "Economy Price", key: "economyPrice" },
    { label: "Economy Seats", key: "economySeats" },
    { label: "Business Price", key: "businessPrice" },
    { label: "Business Seats", key: "businessSeats" },
    { label: "First Class Price", key: "firstPrice" },
    { label: "First Class Seats", key: "firstSeats" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {classes.map(({ label, key }, index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          <FormField label={label} error={errors[key]}>
            <input
              type="number"
              value={tickets[key]}
              onChange={(e) => onChange(key, e.target.value)}
              placeholder={`Enter ${label.toLowerCase()}`}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all focus:outline-none ${
                errors[key]
                  ? "border-red-400 focus:ring-2 focus:ring-red-300 bg-red-50"
                  : "border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 bg-white hover:border-gray-300"
              }`}
            />
          </FormField>
        </motion.div>
      ))}
    </motion.div>
  );
}
