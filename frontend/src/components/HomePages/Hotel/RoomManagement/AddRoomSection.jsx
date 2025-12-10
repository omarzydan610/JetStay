import { motion } from "framer-motion";
import CreateRoomForm from "./CreateRoomForm";
import GlassCard from "../GlassCard";
import SectionHeader from "../HomePage/SectionHeader";

export default function AddRoomSection({ onRoomCreated }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Create New Room"
        description="Add room details, set pricing and availability"
      />

      <GlassCard>
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
            🛏️ Room Information
          </h4>
          <CreateRoomForm onSuccess={onRoomCreated} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
