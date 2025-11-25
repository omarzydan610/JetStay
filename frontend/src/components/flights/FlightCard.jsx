export default function FlightCard({ flight, onEdit }) {
  return (
    <div
      className="bg-white shadow-md rounded p-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => onEdit(flight)}
    >
      <h3 className="text-lg font-bold mb-2">
        {flight.departureAirport} → {flight.arrivalAirport}
      </h3>
      <p className="text-gray-600">
        Departure: {new Date(flight.departureDate).toLocaleString()}
      </p>
      <p className="text-gray-600">
        Arrival: {new Date(flight.arrivalDate).toLocaleString()}
      </p>
      <p className="text-gray-600">Status: {flight.status}</p>
      <p className="text-gray-600">Plane: {flight.planeType}</p>
    </div>
  );
}
