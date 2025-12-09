import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReadOnlyRoomCard from "./ReadOnlyRoomCard";

export default function ReadOnlyRoomList({ loading }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Placeholder: Load rooms from service
    // For now, show empty state
    setRooms([]);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-12"
      >
        <div className="text-center">
          <p className="text-gray-500 text-lg">No rooms available yet</p>
          <p className="text-gray-400 text-sm">
            Create your first room to get started
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {rooms.map((room) => (
        <ReadOnlyRoomCard key={room.roomID} room={room} />
      ))}
    </motion.div>
  );
}
