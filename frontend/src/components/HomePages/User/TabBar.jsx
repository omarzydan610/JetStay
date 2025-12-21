import { motion } from "framer-motion";
import { Plane, Hotel } from "lucide-react";

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="bg-white border-b-2 border-sky-200 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center h-full relative">
        {/* Animated slider background */}
        <motion.div
          layoutId="tabSlider"
          className="absolute bottom-0 h-1 bg-gradient-to-r from-sky-600 to-cyan-600"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: "50%",
            left: activeTab === "flights" ? "0%" : "50%",
          }}
        />

        <button
          onClick={() => onTabChange("flights")}
          className={`py-4 px-6 text-lg font-semibold transition flex items-center justify-center gap-2 w-1/2 relative z-10 ${
            activeTab === "flights"
              ? "text-sky-600"
              : "text-gray-600 hover:text-sky-600"
          }`}
        >
          <Plane size={20} />
          Flights
        </button>

        <button
          onClick={() => onTabChange("hotels")}
          className={`py-4 px-6 text-lg font-semibold transition flex items-center justify-center gap-2 w-1/2 relative z-10 ${
            activeTab === "hotels"
              ? "text-cyan-600"
              : "text-gray-600 hover:text-cyan-600"
          }`}
        >
          <Hotel size={20} />
          Hotels
        </button>
      </div>
    </div>
  );
}
