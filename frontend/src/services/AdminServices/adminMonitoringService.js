import apiClient from "../axiosConfig";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const adminMonitoringService = {
  /**
   * Get booking monitoring data within a date range
   * @param {string} startDate - Start date in format YYYY-MM-DD
   * @param {string} endDate - End date in format YYYY-MM-DD
   * @returns {Promise} Booking monitoring data
   */
  getBookingMonitoring: async (startDate, endDate) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/api/admin/monitor-bookings`,
        {
          params: {
            startDate,
            endDate,
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
   * @returns {Promise} Flight monitoring data
   */
  getFlightMonitoring: async (startDate, endDate) => {
    try {
      const response = await apiClient.get(
        `${API_BASE_URL}/api/admin/monitor-flights`,
        {
          params: {
            startDate,
            endDate,
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
