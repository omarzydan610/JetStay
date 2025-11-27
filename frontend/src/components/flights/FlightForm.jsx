import { useState, useEffect } from "react";
import { createFlight, updateFlight } from "../../services/flightService.js";
import { getCountries, getCities, getAirports } from "../../services/airportService.js";

export default function FlightForm({ editingFlight, clearEditing }) {
  const [form, setForm] = useState({
    departureCountry: "",
    departureCity: "",
    departureAirport: "",
    arrivalCountry: "",
    arrivalCity: "",
    arrivalAirport: "",
    departureDate: "",
    arrivalDate: "",
    status: "PENDING",
    planeType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);

  useEffect(() => {
    loadCountries();
    if (editingFlight) setForm(editingFlight);
  }, [editingFlight]);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res);
    } catch (err) {
      console.error("Error fetching countries", err);
    }
  };

  const handleCountryChange = async (e, type) => {
    const countryCode = e.target.value;
    setForm({
      ...form,
      [`${type}Country`]: countryCode,
      [`${type}City`]: "",
      [`${type}Airport`]: "",
    });
    try {
      const res = await getCities(countryCode);
      if (type === "departure") setDepartureCities(res);
      else setArrivalCities(res);
    } catch (err) {
      console.error("Error fetching cities", err);
    }
  };

  const handleCityChange = async (e, type) => {
    const cityId = e.target.value;
    setForm({
      ...form,
      [`${type}City`]: cityId,
      [`${type}Airport`]: "",
    });
    try {
      const res = await getAirports(cityId);
      if (type === "departure") setDepartureAirports(res);
      else setArrivalAirports(res);
    } catch (err) {
      console.error("Error fetching airports", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const inputClass = (field) =>
    `border ${errors[field] ? "border-red-500" : "border-white/40"} 
     bg-white text-gray-700 p-3 w-full rounded-md 
     focus:outline-none focus:ring-2 focus:ring-white/60 transition`;

  const nowStr = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.flightId) await updateFlight(form.flightId, form);
      else await createFlight(form);
      clearEditing();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow-xl border border-white max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {form.flightId ? "Update Flight" : "Add Flight"}
      </h2>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Departure Country</label>
        <select
          value={form.departureCountry}
          onChange={(e) => handleCountryChange(e, "departure")}
          className={inputClass("departureCountry")}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {departureCities.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Departure City</label>
          <select
            value={form.departureCity}
            onChange={(e) => handleCityChange(e, "departure")}
            className={inputClass("departureCity")}
          >
            <option value="">Select City</option>
            {departureCities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {departureAirports.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Departure Airport</label>
          <select
            name="departureAirport"
            value={form.departureAirport}
            onChange={handleChange}
            className={inputClass("departureAirport")}
          >
            <option value="">Select Airport</option>
            {departureAirports.map((a) => (
              <option key={a.id} value={a.code}>{a.name} ({a.code})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Departure Date & Time</label>
        <input
          type="datetime-local"
          name="departureDate"
          value={form.departureDate}
          onChange={handleChange}
          min={nowStr}
          className={inputClass("departureDate")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Arrival Country</label>
        <select
          value={form.arrivalCountry}
          onChange={(e) => handleCountryChange(e, "arrival")}
          className={inputClass("arrivalCountry")}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {arrivalCities.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Arrival City</label>
          <select
            value={form.arrivalCity}
            onChange={(e) => handleCityChange(e, "arrival")}
            className={inputClass("arrivalCity")}
          >
            <option value="">Select City</option>
            {arrivalCities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>
      )}

      {arrivalAirports.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Arrival Airport</label>
          <select
            name="arrivalAirport"
            value={form.arrivalAirport}
            onChange={handleChange}
            className={inputClass("arrivalAirport")}
          >
            <option value="">Select Airport</option>
            {arrivalAirports.map((a) => (
              <option key={a.id} value={a.code}>{a.name} ({a.code})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Arrival Date & Time</label>
        <input
          type="datetime-local"
          name="arrivalDate"
          value={form.arrivalDate}
          onChange={handleChange}
          min={nowStr}
          className={inputClass("arrivalDate")}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={inputClass("status")}
        >
          <option value="PENDING">PENDING</option>
          <option value="ON_TIME">ON TIME</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Plane Type</label>
        <input
          name="planeType"
          value={form.planeType}
          onChange={handleChange}
          className={inputClass("planeType")}
          placeholder="e.g. Boeing 737"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className={`${inputClass("description")} h-24`}
        />
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold border border-white hover:bg-gray-100"
        >
          {form.flightId ? "Update Flight" : "Create Flight"}
        </button>
      </div>
    </form>
  );
}
