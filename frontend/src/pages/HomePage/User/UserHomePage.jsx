import { useState } from "react";
import { motion } from "framer-motion";
import FlightSearchPage from "./FlightSearchPage";
import HotelSearchPage from "./HotelSearchPage";
import TabBar from "../../../components/HomePages/User/TabBar";
import UpcomingBookingsWidget from "../../../components/HomePages/User/UpcomingBookingsWidget";

export default function UserHomePage() {
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 min-h-screen">
      <UpcomingBookingsWidget />

      {/* Heading */}
      <div className="w-full py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent text-center">
            Discover Your Next Adventure
          </h1>
        </div>
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "flights" ? (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold">Find your next flight</h2>
              <p className="text-sky-100 mt-2">
                Search and book flights from hundreds of airlines
              </p>
            </div>
          </div>
          <FlightSearchPage />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold">Find your next hotel</h2>
              <p className="text-sky-100 mt-2">
                Discover comfortable accommodations at unbeatable rates
              </p>
            </div>
          </div>
          <HotelSearchPage />
        </motion.div>
      )}
    </div>
  );
}
