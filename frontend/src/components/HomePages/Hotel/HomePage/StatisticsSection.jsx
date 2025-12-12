import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatCard from "../StatCard";
import SectionHeader from "../HomePage/SectionHeader";
import RoomTypeChart from "./RoomTypeChart";
import GlassCard from "../GlassCard";
import hotelStatService from "../../../../services/HotelServices/hotelStatistics";

export default function StatisticsSection() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });
  const [roomTypeData, setRoomTypeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await hotelStatService.getHotelStatistics();

        setStats({
          totalRooms: data.totalRooms || 0,
          occupiedRooms: data.occupiedRooms || 0,
          availableRooms: (data.totalRooms || 0) - (data.occupiedRooms || 0),
        });

        if (
          data.roomTypes &&
          Array.isArray(data.roomTypes) &&
          data.roomTypes.length > 0
        ) {
          setRoomTypeData(data.roomTypes);
        }
      } catch (err) {
        console.error("Error fetching hotel statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SectionHeader
        title="Hotel Statistics"
        description="Overview of your hotel performance"
      />

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <StatCard label="Total Rooms" value={stats.totalRooms || 0} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard label="Occupied Rooms" value={stats.occupiedRooms || 0} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard label="Available Rooms" value={stats.availableRooms || 0} />
        </motion.div>
      </motion.div>

      {/* Room Type Pie Charts */}
      {roomTypeData.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard>
            <RoomTypeChart roomTypeData={roomTypeData} />
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
