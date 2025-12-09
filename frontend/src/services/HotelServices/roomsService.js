import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/room";

const roomsService = {
  // Get all room types
  getAllRooms: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  },

  // Add new room type
  addRoom: async (roomData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data?.data || null;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  },

  // Edit room type
  updateRoom: async (id, roomData) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/update/${id}`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  },

  // Delete room type
  deleteRoom: async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data || null;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },
};

export default roomsService;
