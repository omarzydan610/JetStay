import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { getFlights, deleteFlight } from "../../../../services/flightService";
import EditableFlightCard from "./EditableFlightCard";
import SectionHeader from "../HomePage/SectionHeader";
import GlassCard from "../GlassCard";
import UpdateFlightForm from "./UpdateFlightForm";

export default function EditableFlightList() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadFlights = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFlights(page, size);
      const flightsWithIDs = res.data.map((f) => ({
        ...f,
        departureAirportInt: f.departureAirport?.airportID ?? null,
        arrivalAirportInt: f.arrivalAirport?.airportID ?? null,
      }));
      setFlights(flightsWithIDs);
      if (res.totalPages !== undefined) setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error loading flights", err);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  const handleUpdateFlight = async (updatedFlight) => {
    try {
      setFlights((prevFlights) =>
        prevFlights.map((f) =>
          f.flightID === updatedFlight.flightID ? { ...f, ...updatedFlight } : f
        )
      );
      setEditingFlight(null);
    } catch (err) {
      console.error("Error updating flight:", err);
    }
  };

  const handleDeleteFlight = async (flightID) => {
    if (window.confirm("Are you sure you want to delete this flight?")) {
      try {
        setDeletingId(flightID);
        await deleteFlight(flightID);
        setFlights((prevFlights) =>
          prevFlights.filter((f) => f.flightID !== flightID)
        );
        toast.success("Flight deleted successfully!");
      } catch (err) {
        console.error("Error deleting flight:", err);
        toast.error("Error deleting flight. Please try again.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <SectionHeader
        title="Flight Management"
        description="Edit or delete your flights"
      />

      {/* Edit Mode - Show only selected flight and form */}
      {editingFlight ? (
        <>
          {/* Selected Flight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <EditableFlightCard
              flight={editingFlight}
              onEdit={() => {}} // Disabled in edit mode
              onDelete={() => {}} // Disabled in edit mode
              isDeleting={false}
              isEditMode={true}
            />
          </motion.div>

          {/* Edit Form */}
          <GlassCard>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-4">
                ✎ Edit Flight
              </h4>
              <UpdateFlightForm
                editingFlight={editingFlight}
                clearEditing={() => setEditingFlight(null)}
                onUpdate={handleUpdateFlight}
              />
            </div>
          </GlassCard>
        </>
      ) : (
        /* Normal Mode - Show flights list */
        <GlassCard>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.p
                className="text-gray-500 text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading flights...
              </motion.p>
            </div>
          ) : flights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No flights available. Create one to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flights.map((flight, index) => (
                  <motion.div
                    key={flight.flightID}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EditableFlightCard
                      flight={flight}
                      onEdit={setEditingFlight}
                      onDelete={handleDeleteFlight}
                      isDeleting={deletingId === flight.flightID}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: page !== 0 ? 1.05 : 1 }}
                    whileTap={{ scale: page !== 0 ? 0.95 : 1 }}
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg font-semibold bg-sky-100 text-sky-600 hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </motion.button>
                  <span className="text-gray-600 font-semibold self-center">
                    Page {page + 1} of {totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: page < totalPages - 1 ? 1.05 : 1 }}
                    whileTap={{ scale: page < totalPages - 1 ? 0.95 : 1 }}
                    disabled={totalPages > 0 && page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </motion.button>
                </div>
              )}
            </>
          )}
        </GlassCard>
      )}
    </motion.div>
  );
}
