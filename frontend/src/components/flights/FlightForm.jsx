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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingFlight) {
      setForm({
        ...editingFlight,
        departureDate: editingFlight.departureDate?.slice(0, 16),
        arrivalDate: editingFlight.arrivalDate?.slice(0, 16),
      });
    }
  }, [editingFlight]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    Object.keys(form).forEach((key) => {
      if (!form[key] || form[key].trim() === "") {
        newErrors[key] = "Required";
      }
    });

    if (form.departureDate && new Date(form.departureDate) < now) {
      newErrors.departureDate = "Departure cannot be in the past";
    }
    if (form.arrivalDate && new Date(form.arrivalDate) < now) {
      newErrors.arrivalDate = "Arrival cannot be in the past";
    }
    if (
      form.departureDate &&
      form.arrivalDate &&
      new Date(form.arrivalDate) <= new Date(form.departureDate)
    ) {
      newErrors.arrivalDate = "Arrival must be after departure";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

  const inputClass = (field, accent) =>
    `border ${
      errors[field] ? "border-red-500" : accent
    } bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
      errors[field] ? "focus:ring-red-400" : accent.replace("border", "focus:ring")
    } transition`;

  const nowStr = new Date().toISOString().slice(0, 16);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-lg shadow-xl text-white transform transition-all duration-500 hover:scale-[1.01]"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        {form.flightId ? "Update Flight" : "Add Flight"}
      </h2>

      {/* Departure fields */}
      <label className="block text-green-300 font-semibold">Departure Airport</label>
      <input
        type="text"
        name="departureAirport"
        placeholder="Departure Airport"
        value={form.departureAirport}
        onChange={handleChange}
        className={inputClass("departureAirport", "border-green-400")}
      />
      <label className="block text-green-300 font-semibold">Departure Date & Time</label>
      <input
        type="datetime-local"
        name="departureDate"
        value={form.departureDate}
        onChange={handleChange}
        min={nowStr}
        className={inputClass("departureDate", "border-green-400")}
      />

      {/* Arrival fields */}
      <label className="block text-yellow-300 font-semibold">Arrival Airport</label>
      <input
        type="text"
        name="arrivalAirport"
        placeholder="Arrival Airport"
        value={form.arrivalAirport}
        onChange={handleChange}
        className={inputClass("arrivalAirport", "border-yellow-400")}
      />
      <label className="block text-yellow-300 font-semibold">Arrival Date & Time</label>
      <input
        type="datetime-local"
        name="arrivalDate"
        value={form.arrivalDate}
        onChange={handleChange}
        min={nowStr}
        className={inputClass("arrivalDate", "border-yellow-400")}
      />

      {/* Other fields */}
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className={inputClass("status", "border-blue-700")}
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
        className={inputClass("planeType", "border-blue-700")}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className={inputClass("description", "border-blue-700")}
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

      {Object.keys(errors).length > 0 && (
        <p className="text-red-400 text-center mt-4">
          Please fix highlighted fields before submitting.
        </p>
      )}
    </form>
  );
}
