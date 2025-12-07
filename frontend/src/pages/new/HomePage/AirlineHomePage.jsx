import AirlineStatisticsPage from "../../AirlineStatisticsPage";
import { useNavigate } from "react-router-dom";

function AirlineHomePage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/airline/flights");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
        Welcome to Your Airline Dashboard
      </h1>

      <div className="flex-1 w-full max-w-4xl md:max-w-6xl bg-white rounded-xl shadow-lg p-4 md:p-8 overflow-auto">
        <AirlineStatisticsPage />
      </div>

      <button
        onClick={handleNavigate}
        className="mt-6 md:mt-8 bg-white text-gray-800 font-bold py-2 md:py-4 px-6 md:px-10 rounded-xl shadow-md border border-gray-200 hover:bg-gray-100 transition-transform duration-300 hover:scale-105"
      >
        Manage Flights
      </button>
    </div>
  );
}

export default AirlineHomePage;
