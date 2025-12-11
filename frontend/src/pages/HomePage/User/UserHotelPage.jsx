import React, { useEffect, useState, useCallback } from "react";
import { getRoomsGraph } from "../../../services/HotelServices/hotelGraphService";
import UserRoomCard from "../../../components/HomePages/Hotel/UserRoomCard";
import GlassCard from "../../../components/HomePages/Airline/GlassCard";
import { toast } from "react-toastify";

export default function UserRoomPage() {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const size = 20;
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [form, setForm] = useState({
    hotelNameContains: "",
    cityContains: "",
    countryContains: "",
    hotelRating: "",
    roomTypePrice: "",
    roomTypeContains: "", // <-- added for room type
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value) return null;

    if (name === "roomTypePrice") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0) return "Enter a valid non-negative number";
    }

    if (name === "hotelRating") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0 || n > 5) return "Rating must be between 0 and 5";
    }

    return null;
  };

  const handleInputChange = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  };

  const loadRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRoomsGraph(page, size, filter);
      setRooms(res?.data ?? []);
    } catch (err) {
      console.error("Error loading rooms", err);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, [page, size, filter]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const applyFilters = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix filter errors before applying");
      return;
    }

    const cleaned = {};

    if (form.hotelNameContains) cleaned.hotelNameContains = form.hotelNameContains;
    if (form.cityContains) cleaned.cityContains = form.cityContains;
    if (form.countryContains) cleaned.countryContains = form.countryContains;

    if (form.hotelRating) {
      const r = Number(form.hotelRating);
      cleaned.hotelRateGte = Math.max(0, r - 0.5);
      cleaned.hotelRateLte = Math.min(5, r + 2);
    }

    if (form.roomTypePrice) {
      const price = Number(form.roomTypePrice);
      const DELTA = 100;
      cleaned.priceGte = Math.max(0, price - DELTA);
      cleaned.priceLte = price + DELTA;
    }

    if (form.roomTypeContains) {
      cleaned.roomTypeContains = form.roomTypeContains; // <-- room type filter
    }

    setFilter(cleaned);
    setPage(0);
  };

  const clearFilters = () => {
    setForm({
      hotelNameContains: "",
      cityContains: "",
      countryContains: "",
      hotelRating: "",
      roomTypePrice: "",
      roomTypeContains: "",
    });
    setFilter({});
    setPage(0);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-cyan-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Browse Rooms</h1>

        {/* FILTER CARD */}
        <GlassCard>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">🏨 Hotel Name</label>
              <input
                value={form.hotelNameContains}
                onChange={(e) => handleInputChange("hotelNameContains", e.target.value)}
                placeholder="Hotel name"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">🏙️ City</label>
              <input
                value={form.cityContains}
                onChange={(e) => handleInputChange("cityContains", e.target.value)}
                placeholder="City"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">🌍 Country</label>
              <input
                value={form.countryContains}
                onChange={(e) => handleInputChange("countryContains", e.target.value)}
                placeholder="Country"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">⭐ Hotel Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={form.hotelRating || 0}
                onChange={(e) => handleInputChange("hotelRating", e.target.value)}
                className="w-full accent-green-400"
              />
              <span className="text-gray-700 font-medium">{form.hotelRating || 0}</span>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700">💰 Room Price</label>
              <input
                type="range"
                min="50"
                max="2000"
                step="10"
                value={form.roomTypePrice || 0}
                onChange={(e) => handleInputChange("roomTypePrice", e.target.value)}
                className="w-full accent-green-400"
              />
              <span className="text-gray-700 font-medium">${form.roomTypePrice || 0}</span>
            </div>

            {/* ===== Room Type Filter ===== */}
            <div>
              <label className="text-sm font-semibold text-gray-700">🛏️ Room Type</label>
              <input
                value={form.roomTypeContains}
                onChange={(e) => handleInputChange("roomTypeContains", e.target.value)}
                placeholder="Deluxe, Suite…"
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-full flex gap-2 mt-4">
              <button onClick={clearFilters} className="px-3 py-1 bg-gray-200 rounded-md">Reset</button>
              <button onClick={applyFilters} className="px-3 py-1 bg-green-600 text-white rounded-md">Apply</button>
            </div>
          </div>
        </GlassCard>

        {/* RESULTS */}
        <GlassCard>
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Rooms</h2>
              <p className="text-sm text-gray-500">{rooms.length} found</p>
            </div>

            {loading ? (
              <div className="py-16 text-center">Loading rooms…</div>
            ) : rooms.length === 0 ? (
              <div className="py-12 text-center text-gray-600">No rooms found</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {rooms.map((room) => (
                  <UserRoomCard key={room.roomTypeID} room={room} />
                ))}
              </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                disabled={page === 0}
                onClick={handlePrev}
                className="px-4 py-2 bg-green-100 text-green-600 rounded-lg disabled:opacity-50"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-semibold self-center">Page {page + 1}</span>
              <button
                disabled={rooms.length === 0}
                onClick={handleNext}
                className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}