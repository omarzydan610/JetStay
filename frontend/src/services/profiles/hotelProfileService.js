import apiClient from "../axiosConfig";
import authService from "../AuthServices/authService";

/**
 * Fetch hotel profile information
 * @returns {Promise} Hotel profile data
 */
export const getHotelData = async () => {
  try {
    const token = authService.getToken();
    const response = await apiClient.get("/api/hotel/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel profile:", error);
    throw error;
  }
};

/**
 * Update hotel information
 * @param {Object} hotelData - Updated hotel data (name, city, country, latitude, longitude)
 * @returns {Promise} Updated hotel data
 */
export const updateHotelInfo = async (hotelData) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.put("/api/hotel/info", hotelData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating hotel info:", error);
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
    const token = localStorage.getItem("auth_token");
    const response = await apiClient.put("/api/hotel/admin", adminData, {
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
