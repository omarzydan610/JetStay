import React from "react";

const AirlineStatsCard = ({ stats }) => {
  return (
    <div className="p-4 shadow-md rounded-lg bg-white hover:scale-105 hover:shadow-blue-700">
      <h2 className="text-xl font-bold">{stats.airlineName}</h2>
      <p>Total Flights: {stats.totalFlights}</p>
      <p>Total Revenue: ${stats.totalRevenue}</p>
      <p>Average Rating: {stats.avgRating.toFixed(2)}</p>
    </div>
  );
};

export default AirlineStatsCard;
