import apiClient from '../axiosConfig';

class PartnershipService {
  async submitAirlinePartnership(formData) {
    const response = await apiClient.post('/api/partnership/airline', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  }

  async submitHotelPartnership(formData) {
    const response = await apiClient.post('/api/partnership/hotel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  }
}

const partnershipService = new PartnershipService();
export default partnershipService;
