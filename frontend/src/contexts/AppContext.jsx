import React, { createContext, useContext, useState } from "react";
import authService from "../services/AuthServices/authService";
import { getHotelData } from "../services/profiles/hotelProfileService";
import { getAirlineData } from "../services/profiles/airlineProfileService";

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserAndBusinessData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("AppContext: Starting data fetch...");

      // Check if user is authenticated
      const token = localStorage.getItem("auth_token");
      if (!token) {
        console.log("AppContext: No token found, skipping data fetch");
        setLoading(false);
        return;
      }

      // Fetch user data
      const userResponse = await authService.getUserData();
      const user = userResponse.data;
      console.log("AppContext: User data fetched:", user);
      setUserData(user);

      // Fetch business data if user is admin
      if (user?.role === "HOTEL_ADMIN" || user?.role === "AIRLINE_ADMIN") {
        let businessResponse;
        if (user?.role === "HOTEL_ADMIN") {
          console.log("AppContext: Fetching hotel data...");
          businessResponse = await getHotelData();
        } else if (user?.role === "AIRLINE_ADMIN") {
          console.log("AppContext: Fetching airline data...");
          businessResponse = await getAirlineData();
        }
        console.log(
          "AppContext: Business data fetched:",
          businessResponse.data
        );
        setBusinessData(businessResponse.data);
      } else {
        console.log(
          "AppContext: User is not admin, skipping business data fetch"
        );
      }
    } catch (err) {
      console.error("AppContext: Error fetching data:", err);
      setError("Failed to load application data");
    } finally {
      setLoading(false);
      console.log("AppContext: Data fetch completed");
    }
  };

  const clearData = () => {
    setUserData(null);
    setBusinessData(null);
    setError(null);
  };

  const updateUserData = (newUserData) => {
    setUserData((prev) => ({ ...prev, ...newUserData }));
  };

  const updateBusinessData = (newBusinessData) => {
    setBusinessData((prev) => ({ ...prev, ...newBusinessData }));
  };

  const value = {
    userData,
    businessData,
    loading,
    error,
    clearData,
    fetchUserAndBusinessData,
    updateUserData,
    updateBusinessData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
