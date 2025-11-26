import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import airlineStatService from "../services/airlineStats.js";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import logo from "../assets/logo.png"; 
import plane from "../assets/plane.png";
import StatsCard from "../components/airline-statistics/StatsCard.jsx";
import '../css/animation.css';

const COLORS = ["#032b6bff", "#1E40AF"];
const FLIGHTS_PER_PAGE = 2;

const AirlineStatisticsPage = () => {
  const { name } = useParams();
  const airlineName = name;

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
        if (airlineName) {
          const stats = await airlineStatService.getAirlineStats(airlineName);
          setAirlineStats(stats);
          const details = await airlineStatService.getAirlineDetails(airlineName);
          setFlightsData(details || []);
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

  const totalPages = Math.ceil(flightsData.length / FLIGHTS_PER_PAGE);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const paginatedFlights = flightsData.slice(
    currentPage * FLIGHTS_PER_PAGE,
    (currentPage + 1) * FLIGHTS_PER_PAGE
  );

  if (loading) return <p className="p-6 text-gray-300 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-500 text-lg">{error}</p>;

  const flightData = flightStatus
    ? [
        { name: "Pending", value: flightStatus.pendingCount || 0 },
        { name: "On Time", value: flightStatus.onTimeCount || 0 },
      ]
    : [];

  return (
    <div className="p-6 space-y-8 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen animated-bg">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Airline Logo" className="h-20 w-auto" />
      </div>

      {airlineStats && <div className="justify-center mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Airline Stats */}
        {<StatsCard title="Airline Stats" gradientColors={["from-blue-400", "to-blue-600"]}>
            {Object.entries(airlineStats).map(([key, value]) => (
              <p key={key} className="flex justify-between text-white">
                <span className="font-medium">{key}</span>
                <span className="font-semibold">{value}</span>
              </p>
            ))}
          </StatsCard>}

        {/* Animated Plane Card */}
        <div className="rounded-2xl relative overflow-hidden">
          <div className="relative h-24 w-full">
            <img
              src={plane}
              alt="plane"
              className="absolute h-32 w-auto left-0 top-1/2 -translate-y-1/2 animate-fly-up"
            />
          </div>
        </div>


      </div>
    }



      {/* Flight Status & Trip Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <StatsCard title="Flight Status" gradientColors={["from-blue-400", "to-blue-600"]}>
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
              <Tooltip contentStyle={{ backgroundColor: "#1E40AF", color: "#fff", border: "none" }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-white">
            <p>Pending: <span className="font-semibold">{flightStatus?.pendingCount ?? 0}</span></p>
            <p>On Time: <span className="font-semibold">{flightStatus?.onTimeCount ?? 0}</span></p>
          </div>
        </StatsCard>

        <StatsCard title="Trip Type Stats" gradientColors={["from-blue-500", "to-blue-700"]}>
          {tripTypeStats?.averageTicketsPerType ? (
            <ul className="space-y-2">
              {Object.entries(tripTypeStats.averageTicketsPerType).map(([type, value]) => (
                <li key={type} className="flex justify-between bg-blue-300/20 p-2 rounded-md text-white">
                  <span className="font-medium">{type}</span>
                  <span className="font-semibold">{value.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">No trip type data available.</p>
          )}
        </StatsCard>
      </div>

      {/* Flights */}
      {flightsData.length > 0 && (
        <div className="max-w-5xl mx-auto mt-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Flights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedFlights.map((flight) => (
              <StatsCard
                key={flight.flightId}
                title={`${flight.description} (${flight.planeType})`}
                gradientColors={["from-blue-300", "to-blue-500"]}
              >
                <p>From: {flight.departureAirport} → To: {flight.arrivalAirport}</p>
                <p>Departure: {new Date(flight.departureDate).toLocaleString()}</p>
                <p>Arrival: {new Date(flight.arrivalDate).toLocaleString()}</p>
                <p>Status: 
                  <span className={
                    flight.status === "ON_TIME"
                      ? "text-green-300 font-bold"
                      : flight.status === "PENDING"
                      ? "text-amber-300 font-bold"
                      : "text-red-400 font-bold"
                  }>
                    {flight.status}
                  </span>
                </p>
              </StatsCard>
            ))}
          </div>

          {/* Pagination only if more than 1 page */}
          {totalPages > 1 && (
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50 hover:bg-blue-400 transition"
              >
                &larr; Previous
              </button>
              <span className="text-gray-700 font-medium">Page {currentPage + 1} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-blue-300 rounded disabled:opacity-50 hover:bg-blue-400 transition"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirlineStatisticsPage;
