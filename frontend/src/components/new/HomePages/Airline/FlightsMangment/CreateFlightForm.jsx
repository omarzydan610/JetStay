import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createFlight } from "../../../../../services/flightService";
import { getCountries, getCities, getAirports } from "../../../../../services/airportService";
import FormField from "./FormField";
import PrimaryButton from "../PrimaryButton";

export default function CreateFlightForm({ clearEditing, onSuccess }) {
  const [form, setForm] = useState({
    departureCountry: "",
    departureCity: "",
    departureAirportInt: "",
    arrivalCountry: "",
    arrivalCity: "",
    arrivalAirportInt: "",
    departureDate: "",
    arrivalDate: "",
    status: "PENDING",
    planeType: "",
    description: "",
  });

  const [state, setState] = useState({
    countries: [],
    departureCities: [],
    arrivalCities: [],
    departureAirports: [],
    arrivalAirports: [],
    loading: false,
    errors: {},
  });

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setState((prev) => ({ ...prev, countries: res.data || [] }));
    } catch (err) {
      console.error("Error loading countries:", err);
    }
  };

  const loadCities = async (country, type) => {
    try {
      const res = await getCities(country);
      setState((prev) => ({
        ...prev,
        [type === "departure" ? "departureCities" : "arrivalCities"]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading cities:", err);
    }
  };

  const loadAirports = async (country, city, type) => {
    try {
      const res = await getAirports(country, city);
      setState((prev) => ({
        ...prev,
        [type === "departure" ? "departureAirports" : "arrivalAirports"]: res.data || [],
      }));
    } catch (err) {
      console.error("Error loading airports:", err);
    }
  };

  const handleCountryChange = async (e, type) => {
    const country = e.target.value;
    setForm((prev) => ({
      ...prev,
      [`${type}Country`]: country,
      [`${type}City`]: "",
      [`${type}AirportInt`]: "",
    }));
    await loadCities(country, type);
    setState((prev) => ({
      ...prev,
      [type === "departure" ? "departureAirports" : "arrivalAirports"]: [],
    }));
  };

  const handleCityChange = async (e, type) => {
    const city = e.target.value;
    setForm((prev) => ({
      ...prev,
      [`${type}City`]: city,
      [`${type}AirportInt`]: "",
    }));
    const country = form[`${type}Country`];
    await loadAirports(country, city, type);
  };

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
    if (!form.departureAirportInt) errors.departureAirportInt = "Departure airport required";
    if (!form.arrivalAirportInt) errors.arrivalAirportInt = "Arrival airport required";
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
      await createFlight({
        departureAirportInt: parseInt(form.departureAirportInt),
        arrivalAirportInt: parseInt(form.arrivalAirportInt),
        departureDate: form.departureDate,
        arrivalDate: form.arrivalDate,
        status: form.status,
        planeType: form.planeType,
        description: form.description,
      });

      if (onSuccess) onSuccess();
      clearEditing();
      setForm({
        departureCountry: "",
        departureCity: "",
        departureAirportInt: "",
        arrivalCountry: "",
        arrivalCity: "",
        arrivalAirportInt: "",
        departureDate: "",
        arrivalDate: "",
        status: "PENDING",
        planeType: "",
        description: "",
      });
    } catch (err) {
      console.error("Error creating flight:", err);
      setState((prev) => ({
        ...prev,
        errors: { submit: "Failed to create flight. Please try again." },
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

      {/* Departure Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">✈️ Departure</h3>

        <FormField label="Country">
          <select
            value={form.departureCountry}
            onChange={(e) => handleCountryChange(e, "departure")}
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          >
            <option value="">Select departure country</option>
            {state.countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>

        {state.departureCities.length > 0 && (
          <FormField label="City">
            <select
              value={form.departureCity}
              onChange={(e) => handleCityChange(e, "departure")}
              className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
            >
              <option value="">Select departure city</option>
              {state.departureCities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {state.departureAirports.length > 0 && (
          <FormField label="Airport" error={state.errors.departureAirportInt}>
            <select
              name="departureAirportInt"
              value={form.departureAirportInt}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
            >
              <option value="">Select departure airport</option>
              {state.departureAirports.map((a) => (
                <option key={a.airportID} value={a.airportID}>
                  {a.airportName} ({a.airportCode})
                </option>
              ))}
            </select>
          </FormField>
        )}
      </div>

      {/* Arrival Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Arrival</h3>

        <FormField label="Country">
          <select
            value={form.arrivalCountry}
            onChange={(e) => handleCountryChange(e, "arrival")}
            className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
          >
            <option value="">Select arrival country</option>
            {state.countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>

        {state.arrivalCities.length > 0 && (
          <FormField label="City">
            <select
              value={form.arrivalCity}
              onChange={(e) => handleCityChange(e, "arrival")}
              className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
            >
              <option value="">Select arrival city</option>
              {state.arrivalCities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
        )}

        {state.arrivalAirports.length > 0 && (
          <FormField label="Airport" error={state.errors.arrivalAirportInt}>
            <select
              name="arrivalAirportInt"
              value={form.arrivalAirportInt}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-600 focus:outline-none transition"
            >
              <option value="">Select arrival airport</option>
              {state.arrivalAirports.map((a) => (
                <option key={a.airportID} value={a.airportID}>
                  {a.airportName} ({a.airportCode})
                </option>
              ))}
            </select>
          </FormField>
        )}
      </div>

      {/* Flight Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Flight Details</h3>

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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6">
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
            label={state.loading ? "Creating..." : "✈️ Create Flight"}
            type="submit"
            disabled={state.loading}
            loading={state.loading}
          />
        </div>
      </div>
    </motion.form>
  );
}
