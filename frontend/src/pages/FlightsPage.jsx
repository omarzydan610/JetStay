import { useNavigate } from "react-router-dom";
import FlightListCards from "../components/flights/FlightListCards";
import FlightDetailsCard from "../components/flights/FlightDetailsCard";

export default function FlightsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 text-gray-900 p-10">
      {/* Page heading */}
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide text-blue-700">
        Flights Management
      </h1>

      {/* Paginated list of flights as cards */}
      <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-200">
        <FlightListCards />
      </div>

      {/* Add here just for test until Search page done */}
      <FlightDetailsCard id={1} /> 

      {/* Action buttons */}
      <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 shadow-sm hover:bg-gray-300 transition-transform duration-300 hover:scale-105"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={() => navigate("/airline/add-flight")}
          className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-500 transition-transform duration-300 hover:scale-105"
        >
          Add Flight
        </button>
      </div>
    </div>
  );
}
