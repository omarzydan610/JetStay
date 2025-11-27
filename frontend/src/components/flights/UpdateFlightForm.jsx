import { useState, useEffect } from "react";
import { updateFlight } from "../../services/flightService";

export default function UpdateFlightForm({ editingFlight, clearEditing, onUpdate }) {
  const [form, setForm] = useState({
    flightID: null,
    departureAirportInt: "", 
    arrivalAirportInt: "",   
    departureDate: "",
    arrivalDate: "",
    status: "PENDING",
    planeType: "",
    description: "",
  });

  useEffect(() => {
    if (editingFlight) {
      setForm({
        flightID: editingFlight.flightID,
        departureAirportInt: editingFlight.departureAirportInt ?? "",
        arrivalAirportInt: editingFlight.arrivalAirportInt ?? "",
        departureDate: editingFlight.departureDate || "",
        arrivalDate: editingFlight.arrivalDate || "",
        status: editingFlight.status || "PENDING",
        planeType: editingFlight.planeType || "",
        description: editingFlight.description || "",
      });
    }
  }, [editingFlight]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFlightData = {
        departureAirportInt: parseInt(form.departureAirportInt),
        arrivalAirportInt: parseInt(form.arrivalAirportInt),
        departureDate: form.departureDate,
        arrivalDate: form.arrivalDate,
        status: form.status,
        planeType: form.planeType,
        description: form.description,
      };

      await updateFlight(form.flightID, updatedFlightData);

      // Update parent list immediately
      if (onUpdate) onUpdate({ ...form, ...updatedFlightData });

      clearEditing();
    } catch (err) {
      console.error("Error updating flight:", err);
    }
  };

  const inputClass =
    "border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";

  const nowStr = new Date().toISOString().slice(0, 16);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto"
    >
      <h2 className="text-xl font-bold text-center">Update Flight</h2>

      <div>
        <label className="block text-sm font-semibold mb-1">Departure Date & Time</label>
        <input
          type="datetime-local"
          name="departureDate"
          value={form.departureDate}
          onChange={handleChange}
          min={nowStr}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Arrival Date & Time</label>
        <input
          type="datetime-local"
          name="arrivalDate"
          value={form.arrivalDate}
          onChange={handleChange}
          min={nowStr}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="PENDING">PENDING</option>
          <option value="ON_TIME">ON TIME</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Plane Type</label>
        <input
          name="planeType"
          value={form.planeType}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g. Boeing 737"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`${inputClass} h-24`}
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500"
        >
          Update Flight
        </button>
      </div>
    </form>
  );
}
