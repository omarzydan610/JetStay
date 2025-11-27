import apiClient from "./axiosConfig.js";
import authService from "./AuthServices/authService";

const DUMMY_STATS = {
  totalFlights: 12,
  totalPassengers: 350,
  totalRevenue: 50000,
};

const DUMMY_FLIGHT_STATUS = {
  pendingCount: 3,
  onTimeCount: 8,
  cancelledCount: 1,
};

const DUMMY_TRIP_TYPE_STATS = {
 Tickets :{
    Business: 5,
    Economy: 7,
  },
};

const DUMMY_AIRLINE_DETAILS = [
  {
    flightID: 1,
    departureAirport: "Cairo",
    arrivalAirport: "Paris",
    departureDate: new Date().toISOString(),
    arrivalDate: new Date(Date.now() + 3600 * 1000).toISOString(),
    status: "ON_TIME",
    planeType: "Boeing 737",
    description: "Test flight",
  },
];

const airlineStatService = {
  getAirlineStats: async () => {
    try {
      const token = authService.getToken();
      const res = await apiClient.get(`/api/airline/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Airline stats fetched:", res);
    } catch (err) {
      console.error("Error fetching airline stats:", err);
    } finally {
      return DUMMY_STATS;
    }
  },

  getFlightStatus: async () => {
    try {
      const token = authService.getToken();
      const res = await apiClient.get(`/api/airline/flight-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Flight status fetched:", res);
    } catch (err) {
      console.error("Error fetching flight status:", err);
    } finally {
      return DUMMY_FLIGHT_STATUS;
    }
  },

  getTripTypeStats: async () => {
    try {
      const token = authService.getToken();
      const res = await apiClient.get(`/api/airline/trip-type`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Trip type stats fetched:", res);
    } catch (err) {
      console.error("Error fetching trip type stats:", err);
    } finally {
      return DUMMY_TRIP_TYPE_STATS;
    }
  },

  getAirlineDetails: async () => {
    try {
      const token = authService.getToken();
      const res = await apiClient.get(`/api/airline/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Airline details fetched:", res);
    } catch (err) {
      console.error("Error fetching airline details:", err);
    } finally {
      return DUMMY_AIRLINE_DETAILS;
    }
  },
};

export default airlineStatService;
