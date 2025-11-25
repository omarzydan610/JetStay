import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AirlineProfileForm from "../components/airline/AirlineProfileForm";
import FlightList from "../components/flights/FlightList";
import { getMyAirline } from "../services/airlineService";

export default function AirlineDashboardPage() {
  const navigate = useNavigate();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirline = async () => {
      try {
        const res = await getMyAirline();
        setAirline(res.data); // if no data, backend should return null or 404
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
    <div className="container mx-auto p-6">
      {/* Airline profile form handles both create and update */}
      <AirlineProfileForm airline={airline} onSave={setAirline} />

      {/* Show flights only if airline exists */}
      {airline && (
        <>
          <FlightList />
          <div className="mt-6">
            <button
              onClick={() => navigate("/air-line/flights")}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Manage All Flights
            </button>
          </div>
        </>
      )}
    </div>
  );
}
