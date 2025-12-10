import apiClient from "../axiosConfig";

class HotelImageService {
  
  async uploadHotelImage(formData) {
    const response = await apiClient.post(
      `/api/hotels/my-hotel/images`, 
      formData,
      {
        headers: {
          "Content-Type": undefined
        }
      }
    );
    return response.data;
  }

  async getHotelImages() {
    const response = await apiClient.get(`/api/hotels/my-hotel/images`);
    return response.data;
  }

  async deleteHotelImage(imageId) {
    const response = await apiClient.delete(`/api/hotels/my-hotel/images/${imageId}`);
    return response.data;
  }
}

const hotelImageService = new HotelImageService();
export default hotelImageService;