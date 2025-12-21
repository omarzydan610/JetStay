import { Plane } from "lucide-react";
import FlightSearchCard from "./FlightSearchCard";

export default function FlightsList({
  flights,
  loading,
  page,
  onFlightSelect,
  onPrevPage,
  onNextPage,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Flights
          </h2>
          <p className="text-sm text-gray-500 bg-sky-50 px-4 py-2 rounded-lg">
            {flights.length} flights found
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
              <p className="mt-4 text-gray-600">Loading flights…</p>
            </div>
          </div>
        ) : flights.length === 0 ? (
          <div className="py-12 text-center text-gray-600">
            <Plane size={48} className="mx-auto text-sky-300 mb-4" />
            <p>No flights found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {flights.map((flight) => (
              <div
                key={flight.flightID}
                className="w-full transform transition hover:-translate-y-1 hover:shadow-lg"
              >
                <FlightSearchCard
                  flight={flight}
                  onClick={() => onFlightSelect(flight.flightID)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {flights.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 0}
              onClick={onPrevPage}
              className="px-6 py-2 bg-sky-100 text-sky-600 font-semibold rounded-lg hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <span className="text-gray-600 font-semibold px-4 py-2 bg-gray-50 rounded-lg">
              Page {page + 1}
            </span>
            <button
              disabled={flights.length === 0}
              onClick={onNextPage}
              className="px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
