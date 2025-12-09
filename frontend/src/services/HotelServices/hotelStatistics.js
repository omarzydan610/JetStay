import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const hotelStatService = {
  getHotelStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hotel/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return (
        response.data?.data || {
          totalRooms: 0,
          occupiedRooms: 0,
          roomTypes: [],
        }
      );
    } catch (error) {
      console.error("Error fetching hotel statistics:", error);
      return {
        totalRooms: 0,
        occupiedRooms: 0,
        roomTypes: [],
      };
    }
  },
};

export default hotelStatService;
