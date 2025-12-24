import {
  Plane,
  MapPin,
  Globe,
  DollarSign,
  Calendar,
  RotateCcw,
  Search,
} from "lucide-react";

export default function FlightFilters({
  form,
  handleInputChange,
  applyFilters,
  clearFilters,
}) {
  return (
    <div className="border-b-2 border-sky-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Search className="text-sky-600" size={28} />
          Search Flights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Airline Name */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Plane size={18} className="text-sky-600" />
              Airline
            </label>
            <input
              value={form.airlineNameContains}
              onChange={(e) =>
                handleInputChange("airlineNameContains", e.target.value)
              }
              placeholder="Enter airline name"
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          {/* Departure City */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-cyan-600" />
              Departure City
            </label>
            <input
              value={form.departureCityContains}
              onChange={(e) =>
                handleInputChange("departureCityContains", e.target.value)
              }
              placeholder="Enter city name"
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          {/* Arrival City */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-sky-600" />
              Arrival City
            </label>
            <input
              value={form.arrivalCityContains}
              onChange={(e) =>
                handleInputChange("arrivalCityContains", e.target.value)
              }
              placeholder="Enter city name"
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          {/* Departure Country */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Globe size={18} className="text-cyan-600" />
              Departure Country
            </label>
            <input
              value={form.departureCountryContains}
              onChange={(e) =>
                handleInputChange("departureCountryContains", e.target.value)
              }
              placeholder="Enter country name"
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          {/* Arrival Country */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Globe size={18} className="text-sky-600" />
              Arrival Country
            </label>
            <input
              value={form.arrivalCountryContains}
              onChange={(e) =>
                handleInputChange("arrivalCountryContains", e.target.value)
              }
              placeholder="Enter country name"
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-cyan-600" />
              Max Price: ${form.tripTypePrice || 50}
            </label>
            <input
              type="range"
              min="50"
              max="2000"
              step="10"
              value={form.tripTypePrice || 50}
              onChange={(e) =>
                handleInputChange("tripTypePrice", e.target.value)
              }
              className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Departure Date */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-sky-600" />
              Departure Date
            </label>
            <input
              type="date"
              value={form.departureDateGte}
              onChange={(e) =>
                handleInputChange("departureDateGte", e.target.value)
              }
              className="w-full px-4 py-2 border border-sky-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={applyFilters}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-sky-700 hover:to-cyan-700 transition shadow-md"
          >
            <Search size={18} />
            Search
          </button>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
