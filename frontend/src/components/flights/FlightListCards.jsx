import { useEffect, useState, useCallback } from "react";
import { getFlights, updateFlight } from "../../services/flightService";
import FlightCard from "./FlightCard";
import UpdateFlightForm from "./UpdateFlightForm";

export default function FlightListCards() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(9);
  const [totalPages, setTotalPages] = useState(0);

  // Load flights from backend
  const loadFlights = useCallback(async () => {
    try {
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
    }
  }, [page, size]);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  // Handle flight update from the form
  const handleUpdateFlight = async (updatedFlight) => {
    try {
      // Update in DB
      await updateFlight(updatedFlight.flightID, {
        departureAirportInt: updatedFlight.departureAirportInt,
        arrivalAirportInt: updatedFlight.arrivalAirportInt,
        departureDate: updatedFlight.departureDate,
        arrivalDate: updatedFlight.arrivalDate,
        status: updatedFlight.status,
        planeType: updatedFlight.planeType,
        description: updatedFlight.description,
      });

      // Update local state
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

  return (
    <div className="relative bg-gradient-to-br from-sky-200 via-white to-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="absolute inset-0 bg-plane opacity-10 pointer-events-none"></div>

      <div className="relative z-10">
        {editingFlight && (
          <div className="mb-8">
            <UpdateFlightForm
              editingFlight={editingFlight}
              clearEditing={() => setEditingFlight(null)}
              onUpdate={handleUpdateFlight}
            />
          </div>
        )}

        {flights.length === 0 ? (
          <p className="text-gray-500 mt-6 text-center italic">
            No flights available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flights.map((f) => (
              <FlightCard key={f.flightID} flight={f} onEdit={setEditingFlight} />
            ))}
          </div>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-gray-600 font-medium self-center">
            Page {page + 1} of {totalPages || 1}
          </span>
          <button
            disabled={totalPages > 0 && page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-500 transition disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
