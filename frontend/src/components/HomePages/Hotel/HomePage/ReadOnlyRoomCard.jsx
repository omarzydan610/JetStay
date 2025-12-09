import { motion } from "framer-motion";

export default function ReadOnlyRoomCard({ room }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-200 rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800">
          Room {room.roomNumber}
        </h3>
        <p className="text-sm text-gray-600">{room.roomType}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-2xl font-bold text-sky-600">
            ${room.pricePerNight}
          </p>
          <p className="text-xs text-gray-500">per night</p>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            room.status === "AVAILABLE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {room.status}
        </div>
      </div>
    </motion.div>
  );
}
