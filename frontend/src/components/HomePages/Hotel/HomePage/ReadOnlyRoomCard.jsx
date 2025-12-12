import { motion } from "framer-motion";

export default function ReadOnlyRoomCard({ room }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-default border-2 border-sky-200"
    >
      <div className="relative z-10 flex flex-col h-full space-y-4">
        {/* Header with Title */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent flex-1">
            {room.roomTypeName || "Room"}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-sky-200 to-cyan-200" />

        {/* Details Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div className="flex flex-col">
            <p className="text-sky-600 font-semibold text-sm mb-1">PRICE</p>
            <p className="text-gray-900 font-bold text-lg">
              ${room.price || "N/A"}
            </p>
            <p className="text-gray-500 text-sm">per night</p>
          </div>

          {/* Available Rooms */}
          <div className="flex flex-col">
            <p className="text-cyan-600 font-semibold text-sm mb-1">
              AVAILABLE
            </p>
            <p className="text-gray-900 font-bold text-lg">
              {room.quantity || "0"}
            </p>
            <p className="text-gray-500 text-sm">rooms</p>
          </div>

          {/* Max Guests */}
          <div className="flex flex-col">
            <p className="text-sky-600 font-semibold text-sm mb-1">
              MAX GUESTS
            </p>
            <p className="text-gray-900 font-bold text-lg">
              {room.numberOfGuests || "N/A"}
            </p>
            <p className="text-gray-500 text-sm">persons</p>
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <p className="text-cyan-600 font-semibold text-sm mb-1">STATUS</p>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-bold w-fit ${
                room.quantity > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {room.quantity > 0 ? "AVAILABLE" : "FULL"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
