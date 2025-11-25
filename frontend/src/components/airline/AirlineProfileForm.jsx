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
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 mb-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {form.airlineId ? "Update Airline Profile" : "Create Airline Profile"}
      </h2>

      <input
        type="text"
        name="airlineName"
        placeholder="Airline Name"
        value={form.airlineName}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="airlineNationality"
        placeholder="Nationality"
        value={form.airlineNationality}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      {/* Rating is always backend-driven, read-only */}
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Rating</label>
        <p className="border p-2 bg-gray-100 rounded">
          {form.airlineRate !== null ? form.airlineRate : "Not yet rated"}
        </p>
      </div>

      {/* Logo section */}
      <div className="flex items-center gap-4">
        {form.logoUrl ? (
          <img
            src={form.logoUrl}
            alt="Airline Logo"
            className="w-24 h-24 object-contain border rounded"
          />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded">
            No Logo
          </div>
        )}
        <div className="flex gap-2">
          <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700">
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
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove Logo
            </button>
          )}
        </div>
      </div>

      <button className="bg-green-500 text-white px-4 py-2 rounded">
        {form.airlineId ? "Update Profile" : "Create Profile"}
      </button>
    </form>
  );
}
