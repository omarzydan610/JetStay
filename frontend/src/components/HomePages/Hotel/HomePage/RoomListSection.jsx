import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../HomePage/SectionHeader";
import ReadOnlyRoomList from "./ReadOnlyRoomList";
import GlassCard from "../GlassCard";
import PrimaryButton from "../../PrimaryButton";

export default function RoomListSection() {
  const navigate = useNavigate();
  const [loading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Hotel Rooms"
          description="View your available room types"
        />
        <PrimaryButton
          onClick={() => navigate("/hotel/manage-rooms")}
          label="✎ Manage Rooms"
          variant="secondary"
        />
      </div>

      {/* Room List */}
      <GlassCard className="p-6">
        <ReadOnlyRoomList loading={loading} />
      </GlassCard>
    </motion.div>
  );
}
