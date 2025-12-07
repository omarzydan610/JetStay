import { useState } from "react";
import { motion } from "framer-motion";
import CreateFlightForm from "./CreateFlightForm";
import {
  createFlight,
  updateFlight,
} from "../../../../services/flightService";
import GlassCard from "../GlassCard";
import SectionHeader from "../HomePage/SectionHeader";
import TicketClassForm from "./TicketClassForm";

export default function AddFlightSection() {
  const [loading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tickets, setTickets] = useState({
    economyPrice: "",
    economySeats: "",
    businessPrice: "",
    businessSeats: "",
    firstPrice: "",
    firstSeats: "",
  });

  const validateAll = (flightFormData) => {
    const newErrors = {};
    Object.entries(tickets).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = "Required";
      }
    });
    Object.entries(flightFormData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTicketChange = (key, value) => {
    setTickets({ ...tickets, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" });
    }
  };

  const handleSubmitAll = async (flightFormData) => {
    if (!validateAll(flightFormData)) {
      return;
    }

    try {
      if (flightFormData.flightID) {
        await updateFlight(flightFormData.flightID, flightFormData);
      } else {
        await createFlight(flightFormData);
      }
      alert("Flight submitted successfully!");
      setTickets({
        economyPrice: "",
        economySeats: "",
        businessPrice: "",
        businessSeats: "",
        firstPrice: "",
        firstSeats: "",
      });
    } catch (err) {
      console.error("Error saving flight", err);
      alert("Error saving flight. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.p
          className="text-gray-500 text-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Create New Flight"
        description="Add flight details and ticket pricing"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flight Form Section */}
        <GlassCard>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
              Flight Details
            </h4>
            <CreateFlightForm
              clearEditing={() => {}}
              onSubmit={handleSubmitAll}
              errors={errors}
            />
          </div>
        </GlassCard>

        {/* Tickets & Prices Section */}
        <GlassCard>
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
              Ticket Classes
            </h4>
            <TicketClassForm
              tickets={tickets}
              errors={errors}
              onChange={handleTicketChange}
            />
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}
