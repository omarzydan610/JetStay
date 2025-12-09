import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import roomsService from "../../../../services/HotelServices/roomsService";
import ReadOnlyRoomCard from "./ReadOnlyRoomCard";

export default function ReadOnlyRoomList({ loading }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomsService.getAllRooms();
        setRooms(data);
      } catch (error) {
        console.error("Error loading rooms:", error);
        toast.error("Failed to load rooms");
      }
    };

    fetchRooms();
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {rooms.map((room, index) => (
        <motion.div
          key={room.roomTypeID}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ReadOnlyRoomCard room={room} />
        </motion.div>
      ))}
    </motion.div>
  );
}
