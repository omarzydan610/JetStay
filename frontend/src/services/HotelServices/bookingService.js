import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/hotel/booking";

const bookingService = {
  // Create a new room booking
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}`, bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data?.data || null;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },
};

export default bookingService;
