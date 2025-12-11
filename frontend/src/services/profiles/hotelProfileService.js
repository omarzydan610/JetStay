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
 * @param {Object} hotelData - Updated hotel data (name, city, country, latitude, longitude, logoFile)
 * @returns {Promise} Updated hotel data
 */
export const updateHotelData = async (hotelData) => {
  try {
    const token = localStorage.getItem("auth_token");

    // Create FormData for multipart file upload
    const formData = new FormData();

    // Append all fields to FormData
    if (hotelData.name !== undefined && hotelData.name !== null) {
      formData.append("name", hotelData.name);
    }
    if (hotelData.city !== undefined && hotelData.city !== null) {
      formData.append("city", hotelData.city);
    }
    if (hotelData.country !== undefined && hotelData.country !== null) {
      formData.append("country", hotelData.country);
    }
    if (hotelData.latitude !== undefined && hotelData.latitude !== null) {
      formData.append("latitude", hotelData.latitude);
    }
    if (hotelData.longitude !== undefined && hotelData.longitude !== null) {
      formData.append("longitude", hotelData.longitude);
    }
    // Append the file if it exists
    if (hotelData.logoFile instanceof File) {
      formData.append("logoFile", hotelData.logoFile);
    }

    const response = await apiClient.post("/api/hotel/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating hotel info:", error);
    throw error;
  }
};
