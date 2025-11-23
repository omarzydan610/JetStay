import apiClient from "./axiosConfig.js";

const airlineStatService = {
  getAirlineStats: async (airlineName) => {
    try {
      const url = `/api/airline/${airlineName}`;
      const res = await apiClient.get(url);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching airline stats:", err);
      throw err;
    }
  },

  getFlightStatus: async (airlineName) => {
    try {
      const url = airlineName
        ? `/api/airline/flight-status/${airlineName}`
        : `/api/airline/flight-status`;
      const res = await apiClient.get(url);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching flight status:", err);
      throw err;
    }
  },

  getTripTypeStats: async (airlineName) => {
    try {
      const url = airlineName
        ? `/api/airline/trip-type/${airlineName}`
        : `/api/airline/trip-type`;
      const res = await apiClient.get(url);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching trip type stats:", err);
      throw err;
    }
  },
};

export default airlineStatService;
