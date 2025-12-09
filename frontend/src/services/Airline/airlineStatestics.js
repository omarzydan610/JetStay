import apiClient from "../axiosConfig.js";
import authService from "../AuthServices/authService.js";

/**
 * Airline Statistics Service
 * Handles fetching airline performance and flight data
 */
const airlineStatService = {
  /**
   * Fetch comprehensive airline statistics including flight status distribution
   * @returns {Promise<Object>} Combined airline statistics with flight status counts
   */
  getAirlineStatistics: async () => {
    try {
      const token = authService.getToken();
      const res = await apiClient.get(`/api/airline/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Airline statistics fetched:", res.data);
      // Extract data from SuccessResponse wrapper
      return res.data?.data || {};
    } catch (err) {
      console.error("Error fetching airline statistics:", err);
      // Return empty object - let frontend handle missing data gracefully
      return {};
    }
  },
};

export default airlineStatService;
