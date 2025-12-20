import { useState } from "react";
import { Plane, Hotel } from "lucide-react";
import { motion } from "framer-motion";
import FlightSearchPage from "./FlightSearchPage";
import HotelSearchPage from "./HotelSearchPage";

export default function UserHomePage() {
  const [activeTab, setActiveTab] = useState("flights");

  // Flights Card
  const FlightsCard = () => (
    <button
      onClick={() => setActiveTab("flights")}
      className={`h-1/2 w-full flex flex-col items-center justify-center transition-all duration-300 ${
        activeTab === "flights"
          ? "bg-gradient-to-br from-sky-600 to-cyan-600"
          : "bg-gradient-to-br from-sky-50 to-cyan-50 hover:from-sky-100 hover:to-cyan-100"
      }`}
    >
      <Plane
        size={64}
        className={`mb-6 transition-colors ${
          activeTab === "flights" ? "text-white" : "text-sky-600"
        }`}
      />
      <h2
        className={`text-4xl font-bold text-center mb-4 transition-colors ${
          activeTab === "flights" ? "text-white" : "text-gray-800"
        }`}
      >
        Flights
      </h2>
      <p
        className={`text-lg text-center max-w-xs transition-colors ${
          activeTab === "flights" ? "text-sky-100" : "text-gray-600"
        }`}
      >
        Search and book flights from hundreds of airlines
      </p>
    </button>
  );

  // Hotels Card
  const HotelsCard = () => (
    <button
      onClick={() => setActiveTab("hotels")}
      className={`h-1/2 w-full flex flex-col items-center justify-center transition-all duration-300 ${
        activeTab === "hotels"
          ? "bg-gradient-to-br from-sky-600 to-cyan-600"
          : "bg-gradient-to-br from-cyan-50 to-sky-50 hover:from-cyan-100 hover:to-sky-100"
      }`}
    >
      <Hotel
        size={64}
        className={`mb-6 transition-colors ${
          activeTab === "hotels" ? "text-white" : "text-cyan-600"
        }`}
      />
      <h2
        className={`text-4xl font-bold text-center mb-4 transition-colors ${
          activeTab === "hotels" ? "text-white" : "text-gray-800"
        }`}
      >
        Hotels
      </h2>
      <p
        className={`text-lg text-center max-w-xs transition-colors ${
          activeTab === "hotels" ? "text-sky-100" : "text-gray-600"
        }`}
      >
        Discover accommodations at unbeatable rates
      </p>
    </button>
  );

  // Tab Component
  const TabBar = () => (
    <div className="bg-white border-b-2 border-sky-200 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center h-full relative">
        {/* Animated slider background */}
        <motion.div
          layoutId="tabSlider"
          className="absolute bottom-0 h-1 bg-gradient-to-r from-sky-600 to-cyan-600"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            width: "50%",
            left: activeTab === "flights" ? "0%" : "50%",
          }}
        />

        <button
          onClick={() => setActiveTab("flights")}
          className={`py-4 px-6 text-lg font-semibold transition flex items-center justify-center gap-2 w-1/2 relative z-10 ${
            activeTab === "flights"
              ? "text-sky-600"
              : "text-gray-600 hover:text-sky-600"
          }`}
        >
          <Plane size={20} />
          Flights
        </button>
        <button
          onClick={() => setActiveTab("hotels")}
          className={`py-4 px-6 text-lg font-semibold transition flex items-center justify-center gap-2 w-1/2 relative z-10 ${
            activeTab === "hotels"
              ? "text-cyan-600"
              : "text-gray-600 hover:text-cyan-600"
          }`}
        >
          <Hotel size={20} />
          Hotels
        </button>
      </div>
    </div>
  );

  // Render Flight Page
  if (activeTab === "flights")
    return (
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <TabBar />
        <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 min-h-screen">
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold">Find your next flight</h2>
              <p className="text-sky-100 mt-2">
                Search and book flights from hundreds of airlines
              </p>
            </div>
          </div>
          <FlightSearchPage />
        </div>
      </motion.div>
    );

  // Render Hotel Page
  if (activeTab === "hotels")
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <TabBar />
        <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 min-h-screen">
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold">Find your next hotel</h2>
              <p className="text-sky-100 mt-2">
                Discover comfortable accommodations at unbeatable rates
              </p>
            </div>
          </div>
          <HotelSearchPage />
        </div>
      </motion.div>
    );
}
