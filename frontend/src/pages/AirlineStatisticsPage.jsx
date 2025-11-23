import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AirlineStatsCard from "../components/airline-statistics/AirlineStatsCard";
import airlineStatService from "../services/airlineStats.js";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#F59E0B", "#10B981"]; // Pending: amber, On Time: green

const AirlineStatisticsPage = () => {
  const { name } = useParams();
  const airlineName = name; 

  const [airlineStats, setAirlineStats] = useState(null);
  const [flightStatus, setFlightStatus] = useState(null);
  const [tripTypeStats, setTripTypeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        if (airlineName) {
          const stats = await airlineStatService.getAirlineStats(airlineName);
          setAirlineStats(stats);
        }

        const flights = await airlineStatService.getFlightStatus(airlineName);
        const trips = await airlineStatService.getTripTypeStats(airlineName);

        setFlightStatus(flights);
        setTripTypeStats(trips);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch airline data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [airlineName]);

  if (loading) return <p className="p-6 text-gray-500 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-600 text-lg">{error}</p>;

  // Prepare data for PieChart
  const flightData = flightStatus
    ? [
        { name: "Pending", value: flightStatus.pendingCount || 0 },
        { name: "On Time", value: flightStatus.onTimeCount || 0 },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {airlineStats && (
        <div className="max-w-4xl mx-auto">
          <AirlineStatsCard stats={airlineStats} />
        </div>
      )}

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Status */}
        <div className="p-6 shadow-lg rounded-xl bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Flight Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={flightData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {flightData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-gray-700">
            <p>Pending: <span className="font-semibold">{flightStatus?.pendingCount ?? 0}</span></p>
            <p>On Time: <span className="font-semibold">{flightStatus?.onTimeCount ?? 0}</span></p>
          </div>
        </div>

        {/* Trip Type Stats */}
        <div className="p-6 shadow-lg rounded-xl bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Trip Type Stats</h3>
          {tripTypeStats?.averageTicketsPerType ? (
            <ul className="space-y-2">
              {Object.entries(tripTypeStats.averageTicketsPerType).map(([type, value]) => (
                <li key={type} className="flex justify-between bg-gray-100 p-2 rounded-md">
                  <span className="font-medium text-gray-700">{type}</span>
                  <span className="font-semibold text-gray-900">{value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No trip type data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirlineStatisticsPage;
