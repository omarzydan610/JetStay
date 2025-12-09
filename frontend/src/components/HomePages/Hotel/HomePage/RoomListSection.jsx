import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "../HomePage/SectionHeader";
import ReadOnlyRoomList from "./ReadOnlyRoomList";
import GlassCard from "../GlassCard";

export default function RoomListSection() {
  const [loading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Room Management"
        description="View and manage your hotel rooms"
      />

      {/* Room List */}
      <GlassCard className="p-0">
        <ReadOnlyRoomList loading={loading} />
      </GlassCard>
    </motion.div>
  );
}
