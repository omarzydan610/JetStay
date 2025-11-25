export default function FlightCard({ flight, onEdit }) {
  return (
    <div
      onClick={() => onEdit(flight)}
      className="shadow-lg rounded-lg p-6 cursor-pointer 
                 transform transition duration-300 hover:scale-105 hover:shadow-xl text-white"
    >
      <h3 className="text-xl font-bold mb-3 tracking-wide">
        {flight.departureAirport} → {flight.arrivalAirport}
      </h3>

      <p className="text-blue-200 mb-1">
        Departure:{" "}
        <span className="font-semibold text-white">
          {new Date(flight.departureDate).toLocaleString()}
        </span>
      </p>
      <p className="text-blue-200 mb-1">
        Arrival:{" "}
        <span className="font-semibold text-white">
          {new Date(flight.arrivalDate).toLocaleString()}
        </span>
      </p>
      <p className="text-blue-200 mb-1">
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
      <p className="text-blue-200">
        Plane: <span className="font-semibold text-white">{flight.planeType}</span>
      </p>
    </div>
  );
}
