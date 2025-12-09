import { motion } from "framer-motion";
import { useState } from "react";

export default function EditableRoomCard({
  room,
  onEdit,
  onDelete,
  isDeleting,
  isEditMode = false,
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Action Buttons Overlay - Only show if NOT in edit mode */}
      {isHovering && !isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center gap-4 z-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(room)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            ✎ Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(room.roomTypeID)}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-50 transition"
          >
            {isDeleting ? "Deleting..." : "🗑 Delete"}
          </motion.button>
        </motion.div>
      )}

      <div className="relative z-10 space-y-3">
        {/* Room Type Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-sky-900">
            {room.roomTypeName}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-sky-200" />

        {/* Room Details Grid */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          {/* Price */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">PRICE</p>
            <p className="text-sky-900 font-semibold">${room.price}</p>
            <p className="text-sky-700 text-xs">per night</p>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">AVAILABLE</p>
            <p className="text-sky-900 font-semibold">{room.quantity}</p>
            <p className="text-sky-700 text-xs">rooms</p>
          </div>

          {/* Number of Guests */}
          <div>
            <p className="text-sky-700 text-xs font-semibold mb-1">GUESTS</p>
            <p className="text-sky-900 font-semibold">{room.numberOfGuests}</p>
            <p className="text-sky-700 text-xs">max</p>
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <>
            <div className="h-px bg-sky-200" />
            <div>
              <p className="text-sky-700 text-xs font-semibold mb-2">
                DESCRIPTION
              </p>
              <p className="text-sky-800 text-sm line-clamp-2">
                {room.description}
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
