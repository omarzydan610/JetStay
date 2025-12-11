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
 * @param {Object} airlineData - Updated airline data (name, nationality, logoFile)
 * @returns {Promise} Updated airline data
 */
export const updateAirlineData = async (airlineData) => {
  try {
    const token = authService.getToken();

    // Create FormData for multipart file upload
    const formData = new FormData();

    // Append all fields to FormData
    if (airlineData.name !== undefined && airlineData.name !== null) {
      formData.append("name", airlineData.name);
    }
    if (
      airlineData.nationality !== undefined &&
      airlineData.nationality !== null
    ) {
      formData.append("nationality", airlineData.nationality);
    }
    // Append the file if it exists
    if (airlineData.logoFile instanceof File) {
      formData.append("logoFile", airlineData.logoFile);
    }

    const response = await apiClient.post("/api/airline/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating airline info:", error);
    throw error;
  }
};
