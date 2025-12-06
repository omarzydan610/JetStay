import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateFlight } from "../../../../../services/flightService";
import FormField from "./FormField";
import PrimaryButton from "../PrimaryButton";

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

  const [state, setState] = useState({
    loading: false,
    errors: {},
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
      setState((prev) => ({ ...prev, errors: {} }));
    }
  }, [editingFlight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (state.errors[name]) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.departureDate) errors.departureDate = "Departure date required";
    if (!form.arrivalDate) errors.arrivalDate = "Arrival date required";
    if (!form.planeType) errors.planeType = "Plane type required";
    if (new Date(form.departureDate) >= new Date(form.arrivalDate)) {
      errors.arrivalDate = "Arrival must be after departure";
    }
    setState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setState((prev) => ({ ...prev, loading: true }));
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

      if (onUpdate) onUpdate({ ...form, ...updatedFlightData });

      clearEditing();
    } catch (err) {
      console.error("Error updating flight:", err);
      setState((prev) => ({
        ...prev,
        errors: { submit: "Failed to update flight. Please try again." },
      }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const nowStr = new Date().toISOString().slice(0, 16);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {state.errors.submit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
        >
          {state.errors.submit}
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Departure Date & Time" error={state.errors.departureDate}>
          <input
            type="datetime-local"
            name="departureDate"
            value={form.departureDate}
            onChange={handleChange}
            min={nowStr}
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          />
        </FormField>

        <FormField label="Arrival Date & Time" error={state.errors.arrivalDate}>
          <input
            type="datetime-local"
            name="arrivalDate"
            value={form.arrivalDate}
            onChange={handleChange}
            min={nowStr}
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Plane Type" error={state.errors.planeType}>
          <input
            name="planeType"
            value={form.planeType}
            onChange={handleChange}
            placeholder="e.g. Boeing 737"
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          />
        </FormField>

        <FormField label="Status">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          >
            <option value="PENDING">⏳ Pending</option>
            <option value="ON_TIME">✅ On Time</option>
            <option value="CANCELLED">❌ Cancelled</option>
          </select>
        </FormField>
      </div>

      <FormField label="Description (Optional)">
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add flight notes or special instructions..."
          className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition h-24 resize-none"
        />
      </FormField>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <motion.button
          type="button"
          onClick={clearEditing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
        >
          Cancel
        </motion.button>
        <div className="flex-1">
          <PrimaryButton
            label={state.loading ? "Updating..." : "✅ Update Flight"}
            type="submit"
            disabled={state.loading}
            loading={state.loading}
          />
        </div>
      </div>
    </motion.form>
  );
}
