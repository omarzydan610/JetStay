import { motion } from "framer-motion";
import CreateFlightForm from "./CreateFlightForm";
import GlassCard from "../GlassCard";
import SectionHeader from "../HomePage/SectionHeader";

export default function AddFlightSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Create New Flight"
        description="Add flight details, select ticket types, and set pricing"
      />

      <GlassCard>
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
            ✈️ Flight Information
          </h4>
          <CreateFlightForm clearEditing={() => {}} />
        </div>
      </GlassCard>
    </motion.div>
  );
}
