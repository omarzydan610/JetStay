import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateFlightForm from "../components/flights/CreateFlightForm";
import { getMyAirline } from "../services/airlineService";
import { createFlight, updateFlight } from "../services/flightService";

export default function AirlineDashboardPage() {
  const navigate = useNavigate();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);

  // tickets state
  const [tickets, setTickets] = useState({
    economyPrice: "",
    economySeats: "",
    businessPrice: "",
    businessSeats: "",
    firstPrice: "",
    firstSeats: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAirline = async () => {
      try {
        const res = await getMyAirline();
        setAirline(res);
      } catch (err) {
        console.error("Error fetching airline profile", err);
        setAirline(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAirline();
  }, []);

  const validateAll = (flightFormData) => {
    const newErrors = {};
    // validate tickets
    Object.entries(tickets).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = "Required";
      }
    });
    // validate flight form (basic check)
    Object.entries(flightFormData).forEach(([key, value]) => {
      if (!value) {
        newErrors[key] = "Required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAll = async (flightFormData) => {
    if (!validateAll(flightFormData)) {
      return;
    }

    try {
      // Only handle flight API
      if (flightFormData.flightID) {
        await updateFlight(flightFormData.flightID, flightFormData);
        console.log("Flight updated:", flightFormData.flightID);
      } else {
        await createFlight(flightFormData);
        console.log("Flight created");
      }
      // Tickets are validated but not sent to API
      console.log("Tickets validated locally:", tickets);
      alert("Flight submitted successfully (tickets validated locally).");
    } catch (err) {
      console.error("Error saving flight", err);
      alert("Error saving flight");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-700">
        <p className="text-xl animate-pulse">Loading airline profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-200 text-gray-800">
      {/* Top navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 shadow-md">
        <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">
          ✈️ Airline Dashboard
        </h1>
        <nav className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-gray-800"
          >
            Statistics
          </button>
          <button
            onClick={() => navigate("/airline/flights")}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition text-gray-800"
          >
            Manage Flights
          </button>
        </nav>
      </header>

      {/* Main content side by side */}
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flight Form */}
          <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Add / Manage Flights
            </h2>
            <CreateFlightForm
              clearEditing={() => {}}
              onSubmit={handleSubmitAll} // pass combined submit handler
              errors={errors}
            />
          </section>

          {/* Tickets & Prices */}
          <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Tickets & Prices
            </h2>
            <div className="space-y-4">
              {[
                { label: "Economy Price", key: "economyPrice" },
                { label: "Economy Seats", key: "economySeats" },
                { label: "Business Price", key: "businessPrice" },
                { label: "Business Seats", key: "businessSeats" },
                { label: "First Class Price", key: "firstPrice" },
                { label: "First Class Seats", key: "firstSeats" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    value={tickets[key]}
                    onChange={(e) =>
                      setTickets({ ...tickets, [key]: e.target.value })
                    }
                    className={`border ${
                      errors[key] ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-800 p-3 w-full rounded-md focus:outline-none focus:ring-2 ${
                      errors[key] ? "focus:ring-red-400" : "focus:ring-blue-400"
                    } transition`}
                  />
                  {errors[key] && (
                    <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-gray-200 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} SkyWings Admin — All systems cleared for takeoff
      </footer>
    </div>
  );
}
