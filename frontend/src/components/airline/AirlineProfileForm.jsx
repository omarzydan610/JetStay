import React from "react";

export default function AirlineProfileDisplay({ airline }) {
  if (!airline) {
    return (
      <div className="bg-gray-50 p-10 rounded-xl shadow-md text-gray-600 text-center">
        <p className="text-lg font-medium">No airline profile available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
      {/* Header with logo + name */}
      <div className="flex flex-col items-center space-y-4">
        {airline.logoUrl ? (
          <img
            src={airline.logoUrl}
            className="w-28 h-28 object-contain border border-gray-300 rounded-full shadow-sm"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full border border-gray-300">
            No Logo
          </div>
        )}
        <h2 className="text-3xl font-extrabold text-gray-900">
          {airline.airlineName || "Airline Name"}
        </h2>
        <p className="text-gray-500 italic">Airline Profile</p>
      </div>

      {/* Info grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="block text-sm font-semibold text-gray-700">Nationality</span>
          <span className="text-gray-900">{airline.airlineNationality || "N/A"}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <span className="block text-sm font-semibold text-gray-700">Airline ID</span>
          <span className="text-gray-900">{airline.airlineId || "N/A"}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm sm:col-span-2">
          <span className="block text-sm font-semibold text-gray-700">Rating</span>
          <span className="text-gray-900">
            {airline.airlineRate !== null ? airline.airlineRate : "Not yet rated"}
          </span>
        </div>
      </div>
    </div>
  );
}
