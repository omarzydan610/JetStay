import React, { useEffect, useState } from "react";
import airlineStatService from "../services/airlineStats.js";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import logo from "../assets/logo.png"; 
import plane from "../assets/plane.png";
import StatsCard from "../components/airline-statistics/StatsCard.jsx";
import "../css/animation.css";

const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#FF5722", "#9C27B0", "#00BCD4"]; // generic color palette
const FLIGHTS_PER_PAGE = 2;

const AirlineStatisticsPage = () => {
  const [airlineStats, setAirlineStats] = useState(null);
  const [flightStatus, setFlightStatus] = useState(null);
  const [tripTypeStats, setTripTypeStats] = useState(null);
  const [flightsData, setFlightsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const stats = await airlineStatService.getAirlineStats();
        setAirlineStats(stats);

        const details = await airlineStatService.getAirlineDetails();
        setFlightsData(details || []);

        const flights = await airlineStatService.getFlightStatus();
        setFlightStatus(flights);

        const trips = await airlineStatService.getTripTypeStats();
        setTripTypeStats(trips);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch airline data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(flightsData.length / FLIGHTS_PER_PAGE);
  const handlePrevPage = () => { if (currentPage > 0) setCurrentPage(prev => prev - 1); };
  const handleNextPage = () => { if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1); };
  const paginatedFlights = flightsData.slice(currentPage * FLIGHTS_PER_PAGE, (currentPage + 1) * FLIGHTS_PER_PAGE);

  if (loading) return <p className="p-6 text-gray-500 text-lg text-center">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-lg text-center">{error}</p>;

  // Prepare flight status for PieChart dynamically
  const flightData = flightStatus
    ? Object.entries(flightStatus).map(([key, value]) => ({ name: key, value }))
    : [];

  return (
    <div className="min-h-screen p-6 space-y-8 bg-white">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Airline Logo" className="h-20 w-auto" />
      </div>

      {/* Stats & Plane */}
      {airlineStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <StatsCard title="Airline Stats" className="bg-white text-gray-800 shadow rounded-lg p-4">
            {Object.entries(airlineStats).map(([key, value]) => (
              <p key={key} className="flex justify-between py-1">
                <span className="font-medium">{key}</span>
                <span className="font-semibold">{value}</span>
              </p>
            ))}
          </StatsCard>

          {/* Plane Animation */}
<div
  className="p-6 shadow-2xl rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white overflow-hidden relative flex justify-center items-end h-32"
>
  <img
    src={plane}
    alt="plane"
    className="h-20 w-auto animate-fly-inside absolute bottom-0"
  />
</div>

        </div>
      )}

      {/* Flight Status & Trip Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <StatsCard title="Flight Status" className="bg-white text-gray-800 shadow rounded-lg p-4">
          {flightData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={flightData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {flightData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#111", border: "1px solid #ddd" }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-gray-700">
                {flightData.map((item, idx) => (
                  <p key={idx}>{item.name}: <span className="font-semibold">{item.value}</span></p>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600">No flight status data available.</p>
          )}
        </StatsCard>

        <StatsCard title="Trip Type Stats" className="bg-white text-gray-800 shadow rounded-lg p-4">
          {tripTypeStats && Object.keys(tripTypeStats).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(tripTypeStats).map(([type, value]) => (
                <li key={type} className="flex flex-col bg-gray-50 p-2 rounded-md text-gray-800">
                  <span className="font-medium">{type}</span>
                  {typeof value === "object" && value !== null ? (
                    <ul className="ml-2 space-y-1">
                      {Object.entries(value).map(([subType, subValue]) => (
                        <li key={subType}>
                          {subType}: <span className="font-semibold">{subValue}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="font-semibold">{value}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No trip type data available.</p>
          )}
        </StatsCard>
      </div>
    </div>
  );
};

export default AirlineStatisticsPage;
