import { useNavigate } from "react-router-dom";
import FlightListCards from "../components/flights/FlightListCards";

export default function FlightsPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flights Management</h1>

      {/* Paginated list of flights as cards */}
      <FlightListCards />

      {/* Back button to dashboard */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/air-line/data")}
          className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
