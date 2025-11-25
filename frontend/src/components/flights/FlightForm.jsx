import { useState, useEffect } from "react";
import { createFlight, updateFlight } from "../../services/flightService";

export default function FlightForm({ editingFlight, clearEditing }) {
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
      alert("Error saving flight");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-lg shadow-xl text-white transform transition-all duration-500 hover:scale-[1.01]"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {form.flightId ? "Update Flight" : "Add Flight"}
      </h2>

      <input
        type="text"
        name="departureAirport"
        placeholder="Departure Airport"
        value={form.departureAirport}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        type="text"
        name="arrivalAirport"
        placeholder="Arrival Airport"
        value={form.arrivalAirport}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        type="datetime-local"
        name="departureDate"
        value={form.departureDate}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <input
        type="datetime-local"
        name="arrivalDate"
        value={form.arrivalDate}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />

      <div className="flex gap-3 justify-center">
        <button
          className="bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
        >
          {form.flightId ? "Update Flight" : "Add Flight"}
        </button>
        <button
          type="button"
          onClick={clearEditing}
          className="bg-gray-600 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-gray-500 transition-transform duration-300 hover:scale-105"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
