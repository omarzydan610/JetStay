import { useState, useEffect } from "react";
import { saveAirline } from "../../services/airlineService";

export default function AirlineProfileForm({ airline, onSave }) {
  const [form, setForm] = useState({
    airlineName: "",
    airlineNationality: "",
    airlineId: null,
    logoUrl: null,
    airlineRate: null, // always from backend
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (airline) {
      setForm(airline);
    }
  }, [airline]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setForm({ ...form, logoUrl: URL.createObjectURL(file) });
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setForm({ ...form, logoUrl: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await saveAirline(form, logoFile);
      onSave(res.data);
    } catch (err) {
      console.error("Error saving airline", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-blue-900 to-blue-800 shadow-xl rounded-lg p-8 mb-6 space-y-6 text-white transform transition-all duration-500 hover:scale-[1.01]"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
        {form.airlineId ? "Update Airline Profile" : "Create Airline Profile"}
      </h2>

      <input
        type="text"
        name="airlineName"
        placeholder="Airline Name"
        value={form.airlineName}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
      />
      <input
        type="text"
        name="airlineNationality"
        placeholder="Nationality"
        value={form.airlineNationality}
        onChange={handleChange}
        className="border border-blue-700 bg-blue-950 text-white p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
      />

      {/* Rating is always backend-driven, read-only */}
      <div>
        <label className="block text-blue-200 font-semibold mb-2">Rating</label>
        <p className="border border-blue-700 bg-blue-950 text-blue-300 p-3 rounded-md">
          {form.airlineRate !== null ? form.airlineRate : "Not yet rated"}
        </p>
      </div>

      {/* Logo section */}
      <div className="flex items-center gap-6">
        {form.logoUrl ? (
          <img
            src={form.logoUrl}
            alt="Airline Logo"
            className="w-28 h-28 object-contain border-2 border-blue-600 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center bg-blue-950 text-blue-400 rounded-lg border-2 border-blue-700">
            No Logo
          </div>
        )}
        <div className="flex gap-3">
          <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-500 transition-transform duration-300 hover:scale-105">
            {form.logoUrl ? "Change Logo" : "Add Logo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
          </label>
          {form.logoUrl && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-transform duration-300 hover:scale-105"
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      <button
        className="w-full bg-blue-700 text-white px-6 py-3 rounded-md font-semibold shadow-md hover:bg-blue-600 transition-transform duration-300 hover:scale-105"
      >
        {form.airlineId ? "Update Profile" : "Create Profile"}
      </button>
    </form>
  );
}
