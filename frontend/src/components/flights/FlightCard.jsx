import React from "react";

export default function FlightCard({ flight, onEdit }) {
  const handleClick = () => {
    // Pass full flight object including the airport IDs
    onEdit({
      ...flight,
      departureAirportInt: flight.departureAirportInt,
      arrivalAirportInt: flight.arrivalAirportInt,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="shadow-lg rounded-lg p-6 cursor-pointer 
                 transform transition duration-300 hover:scale-105 hover:shadow-xl text-white"
    >
      <h3 className="text-xl font-bold mb-3 tracking-wide text-green-400">
        {flight.departureAirport?.airportName || flight.departureAirport} →{" "}
        {flight.arrivalAirport?.airportName || flight.arrivalAirport}
      </h3>

      <p className="text-blue-900 mb-1">
        Departure:{" "}
        <span className="font-semibold text-green-300">
          {new Date(flight.departureDate).toLocaleString()}
        </span>
      </p>

      <p className="text-blue-900 mb-1">
        Arrival:{" "}
        <span className="font-semibold text-green-300">
          {new Date(flight.arrivalDate).toLocaleString()}
        </span>
      </p>

      <p className="text-blue-900 mb-1">
        Status:{" "}
        <span
          className={`font-semibold ${
            flight.status === "ON_TIME"
              ? "text-green-400"
              : flight.status === "PENDING"
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {flight.status}
        </span>
      </p>

      <p className="text-blue-900">
        Plane:{" "}
        <span className="font-semibold text-green-300">
          {flight.planeType || "N/A"}
        </span>
      </p>
    </div>
  );
}
