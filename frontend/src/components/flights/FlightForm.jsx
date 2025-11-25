import { useState, useEffect } from "react";
import { createFlight, updateFlight } from "../../services/flightService";

export default function FlightForm({editingFlight, clearEditing }) {
  const [form, setForm] = useState({
    departureAirport: "",
    arrivalAirport: "",
    departureDate: "",
    arrivalDate: "",
    status: "PENDING",
    planeType: "",
    description: "",
  });

  useEffect(() => {
    if (editingFlight) {
      setForm({
        ...editingFlight,
        departureDate: editingFlight.departureDate?.slice(0, 16), // format for datetime-local
        arrivalDate: editingFlight.arrivalDate?.slice(0, 16),
      });
    }
  }, [editingFlight]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.flightId) {
        await updateFlight(form.flightId, form);
      } else {
        await createFlight(form);
      }
      clearEditing();
    } catch (err) {
      console.error("Error saving flight", err);
      alert("Error saving flight", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-4 rounded shadow"
    >
      <input
        type="text"
        name="departureAirport"
        placeholder="Departure Airport"
        value={form.departureAirport}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="text"
        name="arrivalAirport"
        placeholder="Arrival Airport"
        value={form.arrivalAirport}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="datetime-local"
        name="departureDate"
        value={form.departureDate}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="datetime-local"
        name="arrivalDate"
        value={form.arrivalDate}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option value="PENDING">Pending</option>
        <option value="ON_TIME">On Time</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
      <input
        type="text"
        name="planeType"
        placeholder="Plane Type"
        value={form.planeType}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <div className="flex gap-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          {form.flightId ? "Update Flight" : "Add Flight"}
        </button>
        <button
          type="button"
          onClick={clearEditing}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
