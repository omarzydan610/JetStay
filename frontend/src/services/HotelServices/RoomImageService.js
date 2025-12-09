import apiClient from "../axiosConfig";

class RoomImageService {
  
  // 1. Upload Image
  async uploadRoomImage(roomTypeId, formData) {
    const response = await apiClient.post(
      `/api/room-types/${roomTypeId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Upload Room Image Response:", response.data);
    return response.data;
  }

  // 2. Get All Images
  async getRoomImages(roomTypeId) {
    const response = await apiClient.get(`/api/room-types/${roomTypeId}/images`);
    console.log("Get Room Images Response:", response.data);
    return response.data;
  }

  // 3. Delete Image
  async deleteRoomImage(imageId) {
    const response = await apiClient.delete(`/api/room-types/images/${imageId}`);
    console.log("Delete Room Image Response:", response.data);
    return response.data;
  }
}

const roomImageService = new RoomImageService();
export default roomImageService;