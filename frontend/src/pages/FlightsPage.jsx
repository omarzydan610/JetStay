import { useNavigate } from "react-router-dom";
import FlightListCards from "../components/flights/FlightListCards";

export default function FlightsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white p-8">
      {/* Page heading */}
      <h1 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
        Flights Management
      </h1>

      {/* Paginated list of flights as cards */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-xl">
        <FlightListCards />
      </div>

      {/* Back button to dashboard */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
        >
          ← Back to Dashboard
        </button>
      </div>

            <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/airline/add-flight")}
          className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
        >
          Add flight
        </button>
      </div>
    </div>
  );
}
