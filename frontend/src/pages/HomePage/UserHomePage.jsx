import { useState } from "react";
import UserFlightPage from "./User/UserFlightPage";
import UserHotelPage from "./User/UserHotelPage";

export default function UserHomePage() {
  const [choice, setChoice] = useState(null);

  const handleBack = () => setChoice(null);

  // Shared Back Button
  const BackButton = () => (
    <button
      className="m-4 px-6 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-semibold rounded-lg shadow hover:from-gray-300 hover:to-gray-400 hover:shadow-md transition transform hover:scale-105"
      onClick={handleBack}
    >
      ← Back to HomePage
    </button>
  );

  if (choice === "flights")
    return (
      <div>
        <BackButton />
        <UserFlightPage />
      </div>
    );

  if (choice === "hotels")
    return (
      <div>
        <BackButton />
        <UserHotelPage />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to JetStay</h1>
      <p className="mb-4 text-gray-600 text-lg">Choose what you want to search for:</p>
      <div className="flex gap-8">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 rounded-xl shadow-lg transition transform hover:scale-105"
          onClick={() => setChoice("flights")}
        >
          ✈️ Search Flights
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-xl shadow-lg transition transform hover:scale-105"
          onClick={() => setChoice("hotels")}
        >
          🏨 Search Hotels
        </button>
      </div>
    </div>
  );
}