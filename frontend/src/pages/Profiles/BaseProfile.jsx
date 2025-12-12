import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import Navbar from "../../components/Navbar";
import HotelProfile from "./HotelProfile";
import AirlineProfile from "./AirlineProfile";
import UserProfile from "./UserProfile";
import AdminProfile from "./AdminProfile";

function BaseProfile() {
  const navigate = useNavigate();
  const { userData, loading, error, fetchUserAndBusinessData } =
    useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserAndBusinessData();
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-4 py-2 rounded hover:from-sky-700 hover:to-cyan-700 transition-all duration-200"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-cyan-50">
      <Navbar />

      {/* Profile Based on Role */}
      {userData.role === "HOTEL_ADMIN" ? (
        <HotelProfile />
      ) : userData.role === "AIRLINE_ADMIN" ? (
        <AirlineProfile />
      ) : userData.role === "SYSTEM_ADMIN" ? (
        <AdminProfile />
      ) : (
        <UserProfile />
      )}
    </div>
  );
}

export default BaseProfile;
