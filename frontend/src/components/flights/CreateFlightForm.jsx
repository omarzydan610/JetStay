import { useState, useEffect } from "react";
import { createFlight } from "../../services/flightService.js";
import { getCountries, getCities, getAirports } from "../../services/airportService.js";

export default function CreateFlightForm({ clearEditing }) {
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

  const [countries, setCountries] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [departureAirports, setDepartureAirports] = useState([]);
  const [arrivalAirports, setArrivalAirports] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const res = await getCountries();
      setCountries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCities = async (country, type) => {
    try {
      const res = await getCities(country);
      type === "departure" ? setDepartureCities(res.data || []) : setArrivalCities(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAirports = async (country, city, type) => {
    try {
      const res = await getAirports(country, city);
      type === "departure" ? setDepartureAirports(res.data || []) : setArrivalAirports(res.data || []);
    } catch (err) {
      console.error(err);
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
    type === "departure" ? setDepartureAirports([]) : setArrivalAirports([]);
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

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.error(err);
    }
  };

  const whiteInput = "border border-white/40 bg-white text-gray-700 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-white/70 transition";
  const nowStr = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-xl border border-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Flight</h2>

      {/* Departure / Arrival Fields */}
      <div>
        <label>Departure Country</label>
        <select value={form.departureCountry} onChange={(e) => handleCountryChange(e, "departure")} className={whiteInput}>
          <option value="">Select Country</option>
          {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {departureCities.length > 0 && (
        <div>
          <label>Departure City</label>
          <select value={form.departureCity} onChange={(e) => handleCityChange(e, "departure")} className={whiteInput}>
            <option value="">Select City</option>
            {departureCities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      )}

      {departureAirports.length > 0 && (
        <div>
          <label>Departure Airport</label>
          <select name="departureAirportInt" value={form.departureAirportInt} onChange={handleChange} className={whiteInput}>
            <option value="">Select Airport</option>
            {departureAirports.map((a) => <option key={a.airportID} value={a.airportID}>{a.airportName}</option>)}
          </select>
        </div>
      )}

      <div>
        <label>Arrival Country</label>
        <select value={form.arrivalCountry} onChange={(e) => handleCountryChange(e, "arrival")} className={whiteInput}>
          <option value="">Select Country</option>
          {countries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {arrivalCities.length > 0 && (
        <div>
          <label>Arrival City</label>
          <select value={form.arrivalCity} onChange={(e) => handleCityChange(e, "arrival")} className={whiteInput}>
            <option value="">Select City</option>
            {arrivalCities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      )}

      {arrivalAirports.length > 0 && (
        <div>
          <label>Arrival Airport</label>
          <select name="arrivalAirportInt" value={form.arrivalAirportInt} onChange={handleChange} className={whiteInput}>
            <option value="">Select Airport</option>
            {arrivalAirports.map((a) => <option key={a.airportID} value={a.airportID}>{a.airportName}</option>)}
          </select>
        </div>
      )}

      {/* Dates */}
      <div>
        <label>Departure Date & Time</label>
        <input type="datetime-local" name="departureDate" value={form.departureDate} onChange={handleChange} min={nowStr} className={whiteInput} />
      </div>
      <div>
        <label>Arrival Date & Time</label>
        <input type="datetime-local" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} min={nowStr} className={whiteInput} />
      </div>

      {/* Plane Type */}
      <div>
        <label>Plane Type</label>
        <input name="planeType" value={form.planeType} onChange={handleChange} placeholder="Boeing 737" className={whiteInput} />
      </div>

      {/* Status */}
      <div>
        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange} className={whiteInput}>
          <option value="PENDING">PENDING</option>
          <option value="ON_TIME">ON TIME</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Description */}
      <div>
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className={`${whiteInput} h-24`} />
      </div>

      <button type="submit" className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold border border-white hover:bg-white/90">Create Flight</button>
    </form>
  );
}
