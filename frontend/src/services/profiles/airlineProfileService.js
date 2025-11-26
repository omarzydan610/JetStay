import apiClient from "../axiosConfig";
import authService from "../AuthServices/authService";

/**
 * Fetch airline profile information
 * @returns {Promise} Airline profile data
 */
export const getAirlineData = async () => {
  try {
    const token = authService.getToken();
    const response = await apiClient.get("/api/airline/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching airline profile:", error);
    throw error;
  }
};

/**
 * Update airline information
 * @param {Object} airlineData - Updated airline data (name, nationality, logoUrl)
 * @returns {Promise} Updated airline data
 */
export const updateAirlineInfo = async (airlineData) => {
  try {
    const token = authService.getToken();
    const response = await apiClient.put("/api/airline/info", airlineData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating airline info:", error);
    throw error;
  }
};

/**
 * Update admin information
 * @param {Object} adminData - Updated admin data (firstName, lastName, email, phoneNumber)
 * @returns {Promise} Updated admin data
 */
export const updateAdminInfo = async (adminData) => {
  try {
    const token = authService.getToken();
    const response = await apiClient.put("/api/airline/admin", adminData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating admin info:", error);
    throw error;
  }
};
