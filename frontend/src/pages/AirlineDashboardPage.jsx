import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirlineProfileForm from "../components/airline/AirlineProfileForm";
import FlightForm from "../components/flights/FlightForm";
import FlightList from "../components/flights/FlightList";
import { getMyAirline } from "../services/airlineService";

export default function AirlineDashboardPage() {
  const navigate = useNavigate();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAirline = async () => {
      try {
        const res = await getMyAirline();
        setAirline(res.data); // backend returns airline or null
      } catch (err) {
        console.error("Error fetching airline profile", err);
        setAirline(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAirline();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading airline profile...</p>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 text-white flex flex-col">
      {/* Top navbar with hamburger */}
      <header className="bg-blue-900 p-4 flex items-center shadow-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col gap-1 p-2 rounded-md bg-blue-800 hover:bg-blue-700 transition"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
        <h1 className="ml-4 text-xl font-bold">Airline Dashboard</h1>
      </header>

      {/* Overlay (blur effect) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 transition"
        ></div>
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 p-6 shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close (X) icon */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <button
            onClick={() => navigate(`/air-line/${airline?.airlineName}`)}
            className="w-full text-left px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition"
          >
            Statistics
          </button>
          <button
            onClick={() => navigate("/reset-password")}
            className="w-full text-left px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition"
          >
            Change Password
          </button>
          <button
            onClick={() => navigate("/air-line/flights")}
            className="w-full text-left px-4 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition"
          >
            Manage Flights
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Profile + Add Flight side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-xl">
            <AirlineProfileForm airline={airline} onSave={setAirline} />
          </div>
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-xl">
            <FlightForm clearEditing={() => {}} />
          </div>
        </div>
      </main>
    </div>
  );
}
