import apiClient from "../axiosConfig";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const adminMonitoringService = {
  /**
   * Get all hotels list
   * @returns {Promise} List of hotels with id and name
   */
  getAllHotels: async () => {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/api/admin/hotels`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching hotels list:", error);
      throw error;
    }
  },

  /**
   * Get all airlines list
   * @returns {Promise} List of airlines with id and name
   */
  getAllAirlines: async () => {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/api/admin/airlines`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        }
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching airlines list:", error);
      throw error;
    }
  },

  /**
   * Get booking monitoring data within a date range
   * @param {string} startDate - Start date in format YYYY-MM-DD
   * @param {string} endDate - End date in format YYYY-MM-DD
   * @param {number} hotelId - Hotel ID (0 for all hotels)
   * @returns {Promise} Booking monitoring data
   */
  getBookingMonitoring: async (startDate, endDate, hotelId = 0) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/api/admin/monitor-bookings`,
        {
          params: {
            startDate,
            endDate,
            hotelId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error fetching booking monitoring data:", error);
      throw error;
    }
  },

  /**
   * Get flight transaction monitoring data within a date range
   * @param {string} startDate - Start date in format YYYY-MM-DD
   * @param {string} endDate - End date in format YYYY-MM-DD
   * @param {number} airlineId - Airline ID (0 for all airlines)
   * @returns {Promise} Flight monitoring data
   */
  getFlightMonitoring: async (startDate, endDate, airlineId = 0) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/api/admin/monitor-flights`,
        {
          params: {
            startDate,
            endDate,
            airlineId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error fetching flight monitoring data:", error);
      throw error;
    }
  },
};

export default adminMonitoringService;
