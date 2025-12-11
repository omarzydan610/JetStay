import React, { useEffect, useState, useCallback } from "react";
import { getFlightsGraph } from "../../../services/Airline/flightsService";
import UserFlightCard from "../../../components/HomePages/UserFlightCard";
import FlightDetailsCard from "../../../components/flights/FlightDetailsCard";
import GlassCard from "../../../components/HomePages/Airline/GlassCard";
import { toast } from "react-toastify";

export default function UserFlightPage() {
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0);
  const size = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastFetchedPage, setLastFetchedPage] = useState(-1);
  const [lastFilterKey, setLastFilterKey] = useState("");
  const [selectedFlightId, setSelectedFlightId] = useState(null);

  const [filter, setFilter] = useState({});

  const [form, setForm] = useState({
    airlineNameContains: "",
    departureAirportNameContains: "",
    arrivalAirportNameContains: "",
    departureCityContains: "",
    departureCountryContains: "",
    arrivalCityContains: "",
    arrivalCountryContains: "",
    departureDateGte: "",
    arrivalDateGte: "",
    tripTypeNameContains: "",
    tripTypePrice: "",
  });

  const [errors, setErrors] = useState({});

  const VALID_TRIP_TYPES = new Set(["ECONOMY", "BUSINESS", "FIRST_CLASS"]);

  function validateField(name, value) {
    if (!value) return null;

    if (name === "tripTypePrice") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0) return "Enter a valid non-negative number";
      return null;
    }

    if (name.endsWith("DateGte")) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return "Invalid date format";
      return null;
    }

    if (name === "tripTypeNameContains") {
      const up = value.toUpperCase();
      if (!VALID_TRIP_TYPES.has(up))
        return `Must be one of: ${Array.from(VALID_TRIP_TYPES).join(", ")}`;
      return null;
    }

    return null;
  }

  function handleInputChange(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  }

  const loadFlights = useCallback(async () => {
    try {
      setLoading(true);
      const filterKey = JSON.stringify(filter || {});
      if (lastFetchedPage === page && lastFilterKey === filterKey) return;

      const res = await getFlightsGraph(page, size, filter);
      const flightsData = res?.data ?? [];

      const flightsWithIDs = flightsData.map((f) => ({
        ...f,
        departureAirportInt: f.departureAirport?.airportID ?? null,
        arrivalAirportInt: f.arrivalAirport?.airportID ?? null,
      }));

      setFlights(flightsWithIDs);
      if (res.totalPages !== undefined) setTotalPages(res.totalPages);

      setLastFetchedPage(page);
      setLastFilterKey(filterKey);
    } catch (err) {
      console.error("Error loading flights", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, filter, lastFetchedPage, lastFilterKey]);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  useEffect(() => {
    setPage(0);
    setLastFetchedPage(-1);
    setLastFilterKey("");
  }, [filter]);

  const applyFilters = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix filter errors before applying");
      return;
    }

    const cleaned = {};
    Object.entries(form).forEach(([k, v]) => {
      if (!v) return;

      // DATE FILTERS
      if (k.endsWith("DateGte")) {
        const normalizedGte = `${v}T00:00:00`;
        cleaned[k] = normalizedGte;

        try {
          const base = new Date(`${v}T00:00:00`);
          const next = new Date(base);
          next.setMonth(next.getMonth() + 1);
          const isoNext = next.toISOString().slice(0, 10);

          cleaned[k.replace("Gte", "Lte")] = `${isoNext}T23:59:59`;
        } catch {
          cleaned[k.replace("Gte", "Lte")] = `${v}T23:59:59`;
        }
        return;
      }

      if (k === "tripTypePrice") {
        const p = Number(v);
        const PRICE_DELTA = 200;
        if (!Number.isNaN(p)) {
          cleaned["tripTypePriceGte"] = Math.max(0, p - PRICE_DELTA);
          cleaned["tripTypePriceLte"] = p + PRICE_DELTA;
        }
        return;
      }

      cleaned[k] = v;
    });

    setFilter(cleaned);
  };

  const handlePrev = () => {
    const prevPage = Math.max(0, page - 1);
    if (prevPage === page) return;

    (async () => {
      try {
        setLoading(true);
        const res = await getFlightsGraph(prevPage, size, filter);
        const flightsData = res?.data ?? [];

        if (flightsData.length === 0) {
          toast.info("No previous flights");
          return;
        }

        const flightsWithIDs = flightsData.map((f) => ({
          ...f,
          departureAirportInt: f.departureAirport?.airportID ?? null,
          arrivalAirportInt: f.arrivalAirport?.airportID ?? null,
        }));

        setFlights(flightsWithIDs);
        setPage(prevPage);
        setLastFetchedPage(prevPage);
        setLastFilterKey(JSON.stringify(filter || {}));
      } catch (err) {
        toast.error("Failed to load previous page");
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleNext = async () => {
    const nextPage = page + 1;
    try {
      setLoading(true);
      const res = await getFlightsGraph(nextPage, size, filter);
      const flightsData = res?.data ?? [];

      if (flightsData.length === 0) {
        toast.info("No more flights");
      }

      const flightsWithIDs = flightsData.map((f) => ({
        ...f,
        departureAirportInt: f.departureAirport?.airportID ?? null,
        arrivalAirportInt: f.arrivalAirport?.airportID ?? null,
      }));

      setFlights(flightsWithIDs);
      setPage(nextPage);
    } catch (err) {
      toast.error("Failed to load next page");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setForm({
      airlineNameContains: "",
      departureAirportNameContains: "",
      arrivalAirportNameContains: "",
      departureCityContains: "",
      departureCountryContains: "",
      arrivalCityContains: "",
      arrivalCountryContains: "",
      departureDateGte: "",
      arrivalDateGte: "",
      tripTypeNameContains: "",
      tripTypePrice: "",
    });
    setFilter({});
  };

  if (selectedFlightId) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        {/* Outer frame */}
        <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-4xl p-6">
          
          {/* Close button */}
          <button
            onClick={() => setSelectedFlightId(null)}
            className="absolute top-0 left-0 w-10 h-10 flex items-center justify-center 
                      bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 
                      transition shadow-md"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Flight details inside framed card */}
          <FlightDetailsCard id={selectedFlightId} />
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Browse Flights</h1>

        {/* FILTER CARD */}
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={clearFilters}
                  className="text-sm px-3 py-1 bg-white/70 hover:bg-white rounded-md shadow-sm"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="text-sm px-3 py-1 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-md shadow-md"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Airline */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          ✈️ Airline
        </label>
        <input
          value={form.airlineNameContains}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
            handleInputChange("airlineNameContains", cleaned);
          }}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="e.g. Air"
        />
      </div>

      {/* Departure City */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🏙️ Departure City
        </label>
        <input
          value={form.departureCityContains}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
            handleInputChange("departureCityContains", cleaned);
          }}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="City"
        />
      </div>

      {/* Arrival City */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🏙️ Arrival City
        </label>
        <input
          value={form.arrivalCityContains}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
            handleInputChange("arrivalCityContains", cleaned);
          }}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="City"
        />
      </div>

      {/* Price Slider */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          💰 Price
        </label>
        <input
          type="range"
          min="50"
          max="2000"
          value={form.tripTypePrice || 0}
          onChange={(e) => handleInputChange("tripTypePrice", e.target.value)}
          className="w-full accent-sky-400"
        />
        <span className="text-gray-700 font-medium">${form.tripTypePrice || 0}</span>
      </div>

      {/* Departure Country */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🌍 Departure Country
        </label>
        <input
          value={form.departureCountryContains}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
            handleInputChange("departureCountryContains", cleaned);
          }}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="Country"
        />
      </div>

      {/* Arrival Country */}
      <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          🌍 Arrival Country
        </label>
        <input
          value={form.arrivalCountryContains}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^A-Za-z\s]/g, "");
            handleInputChange("arrivalCountryContains", cleaned);
          }}
          className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
          placeholder="Country"
        />
      </div>

        {/* DEPARTURE DATE */}
        <div className="space-y-4 p-4 bg-white/70 backdrop-blur-md rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700">📅 Departure Date</label>
        <input
            type="date"
            value={form.departureDateGte}
            onChange={(e) => handleInputChange("departureDateGte", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white/80 cursor-pointer"
        />
        </div>

        {/* ARRIVAL DATE */}
        <div className="space-y-4 p-4 bg-white/70 backdrop-blur-md rounded-lg shadow-sm">
        <label className="block text-sm font-medium text-gray-700">📅 Arrival Date</label>
        <input
            type="date"
            value={form.arrivalDateGte}
            onChange={(e) => handleInputChange("arrivalDateGte", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none bg-white/80 cursor-pointer"
        />
        </div>

    </div>
          </div>
        </GlassCard>

        {/* RESULTS */}
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Flights</h2>
                <p className="text-sm text-gray-500">
                  Showing results — {flights.length} found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center">Loading flights…</div>
            ) : flights.length === 0 ? (
              <div className="py-12 text-center text-gray-600">
                No flights found
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {flights.map((flight) => (
                    <div
                      key={flight.flightID}
                      className="w-full transform transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <UserFlightCard flight={flight} onClick={() => setSelectedFlightId(flight.flightID)}/>
                    </div>
                  ))}
                </div>
              </>
            )}
                {/* PAGINATION */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    disabled={page === 0}
                    onClick={handlePrev}
                    className="px-4 py-2 bg-sky-100 text-sky-600 rounded-lg disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  <span className="text-gray-600 font-semibold self-center">
                    Page {page + 1} {totalPages ? `of ${totalPages}` : ""}
                  </span>

                  <button
                    disabled={flights.length === 0}
                    onClick={handleNext}
                    className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg disabled:opacity-50"
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
