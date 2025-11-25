import { useEffect, useState } from "react";
import { getFlights } from "../../services/flightService";
import FlightCard from "./FlightCard";
import FlightForm from "./FlightForm";

export default function FlightListCards() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(6); // cards per page

  useEffect(() => {
    loadFlights();
  }, [page]);

  const loadFlights = async () => {
    try {
      const res = await getFlights(page, size);
      if (res.data && res.data.content && res.data.content.length > 0) {
        setFlights(res.data.content);
      } else {
        // fallback to dummy data if backend empty
        setFlights(dummyFlights.slice(page * size, page * size + size));
      }
    } catch (err) {
      console.error("Error loading flights", err);
      // fallback to dummy data if backend fails
      setFlights(dummyFlights.slice(page * size, page * size + size));
    }
  };

  return (
    <div>
      {editingFlight && (
        <div className="mb-6">
          <FlightForm
            editingFlight={editingFlight}
            onSuccess={loadFlights}
            clearEditing={() => setEditingFlight(null)}
          />
        </div>
      )}

      {flights.length === 0 ? (
        <p className="text-gray-500 mt-4 text-center">
          No flights available
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((f) => (
            <FlightCard key={f.flightId} flight={f} onEdit={setEditingFlight} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Dummy data for testing
const dummyFlights = Array.from({ length: 25 }).map((_, i) => ({
  flightId: i + 1,
  airlineId: 1,
  departureAirport: `City ${i + 1}`,
  arrivalAirport: `City ${i + 2}`,
  departureDate: new Date(2025, 0, i + 1, 10, 0).toISOString(),
  arrivalDate: new Date(2025, 0, i + 1, 14, 0).toISOString(),
  status: i % 3 === 0 ? "ON_TIME" : i % 3 === 1 ? "PENDING" : "CANCELLED",
  description: `Test flight number ${i + 1}`,
  planeType: i % 2 === 0 ? "Airbus A320" : "Boeing 737",
}));
