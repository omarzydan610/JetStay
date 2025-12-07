import { motion } from "framer-motion";
import ReadOnlyFlightList from "./ReadOnlyFlightList";

export default function FlightListSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ReadOnlyFlightList />
    </motion.div>
  );
}
