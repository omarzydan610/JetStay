import apiClient from './axiosConfig';

class PartnershipService {
  async submitAirlinePartnership(formData) {
    const response = await apiClient.post('/partnership/airline', formData);
    return response.data;
  }

  async submitHotelPartnership(formData) {
    const response = await apiClient.post('/partnership/hotel', formData);
    return response.data;
  }
}
const partnershipService = new PartnershipService();
export default partnershipService;
