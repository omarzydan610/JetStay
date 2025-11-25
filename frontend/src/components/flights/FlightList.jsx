import { useEffect, useState } from "react";
import FlightForm from "./FlightForm";

export default function FlightList() {
  const [flights, setFlights] = useState([]);
  const [editingFlight, setEditingFlight] = useState(null);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Flights</h2>

      {/* Form for add/update */}
      <FlightForm
        editingFlight={editingFlight}
        clearEditing={() => setEditingFlight(null)}
      />

    </div>
  );
}
