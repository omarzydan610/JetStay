import { useEffect, useState, useCallback } from "react";
import { getFlights } from "../../services/flightService";
import FlightCard from "./FlightCard";
import FlightForm from "./FlightForm";

export default function FlightListCards() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(9); // cards per page

const loadFlights = useCallback(async () => {
  try {
    const res = await getFlights(page, size);
    setFlights(res.data?.content?.length ? res.data.content : dummyFlights.slice(page * size, page * size + size));
  } catch (err) {
    console.error("Error loading flights", err);
    setFlights(dummyFlights.slice(page * size, page * size + size));
  }
}, [page, size]);

useEffect(() => {
  loadFlights();
}, [loadFlights]);


  return (
    <div className="relative bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-xl text-white overflow-hidden">
      {/* Animated plane background */}
      <div className="absolute inset-0 bg-plane pointer-events-none"></div>

      {/* Content above background */}
      <div className="relative z-10">
        {editingFlight && (
          <div className="mb-6">
            <FlightForm
              editingFlight={editingFlight}
              clearEditing={() => setEditingFlight(null)}
            />
          </div>
        )}

        {flights.length === 0 ? (
          <p className="text-blue-200 mt-4 text-center italic">
            No flights available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((f) => (
              <FlightCard
                key={f.flightId}
                flight={f}
                onEdit={setEditingFlight}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex justify-between mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-blue-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
          >
            Next →
          </button>
        </div>
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
