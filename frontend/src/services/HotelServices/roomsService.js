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
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return response.data || null;
    } catch (error) {
      console.error("Error deleting room:", error);
      throw error;
    }
  },

  // 1. Get images for a specific room type
  getRoomImages: async (roomTypeId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/${roomTypeId}/images`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching room images:", error);
      return [];
    }
  },

  // 2. Upload an image for a room type
  uploadRoomImage: async (roomTypeId, file) => {
    const formData = new FormData();
    formData.append("file", file); // Must match @RequestParam("file") in backend

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${roomTypeId}/images/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            "Content-Type": "multipart/form-data", // Crucial for file uploads
          },
        }
      );
      return response.data?.data || null;
    } catch (error) {
      console.error("Error uploading room image:", error);
      throw error;
    }
  },

  // 3. Delete a specific image
  deleteRoomImage: async (imageId) => {
    try {
      console.log("Deleting image with ID:", imageId);
      const response = await axios.delete(
        `${API_BASE_URL}/images/delete/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return response.data || null;
    } catch (error) {
      console.error("Error deleting room image:", error);
      throw error;
    }
  },
    // 4. Add room offer
  addRoomOffer: async (offerData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/offers/add`, offerData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "application/json",
        },
      });
      return response.data?.data || null;
    } catch (error) {
      console.error("Error adding room offer:", error);
      throw error;
    }
  },

    // 5. Get room offers for hotel
  getRoomOffers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/offers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching room offers:", error);
      return [];
    }
  },
    // 6. Delete room offer
  deleteRoomOffer: async (offerId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/offers/delete/${offerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return response.data || null;
    } catch (error) {
      console.error("Error deleting room offer:", error);
      throw error;
    }
  },
  
};

export default roomsService;